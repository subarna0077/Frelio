import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { planId } = await req.json();

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Unknown plan" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (plan.price_npr <= 0) {
      return new Response(
        JSON.stringify({ error: "This plan does not require payment" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from("subscription_payments")
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        amount: plan.price_npr,
        status: "pending",
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    const khaltiKey = Deno.env.get('KHALTI_SECRET_KEY');

    if (!khaltiKey) {
      return new Response(
        JSON.stringify({ error: 'Khalti secret key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://dev.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${khaltiKey}`
      },
      body: JSON.stringify({
        return_url: `${Deno.env.get("FRONTEND_URL")}/billing/payment-success`,
        amount: plan.price_npr,
        purchase_order_id: payment.id,
        purchase_order_name: `Frelio ${plan.name} plan`,
        website_url: `${Deno.env.get("FRONTEND_URL")}`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ detail: error.detail ?? 'Khalti error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ ...data, payment_id: payment.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : String(err)
    }), { status: 500, headers: corsHeaders });
  }
});
