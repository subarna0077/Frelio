import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pidx, paymentId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const khaltiKey = Deno.env.get('KHALTI_SECRET_KEY');

    if (!khaltiKey) {
      return new Response(
        JSON.stringify({ error: 'Khalti secret key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://dev.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${khaltiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ detail: error.detail ?? 'Khalti error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const khaltiData = await response.json();

    if (khaltiData.status !== "Completed") {
      return new Response(JSON.stringify({ message: "Payment not completed" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: payment, error: paymentFetchError } = await supabase
      .from("subscription_payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (paymentFetchError) throw paymentFetchError;

    const now = new Date().toISOString();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { error: paymentUpdateError } = await supabase
      .from("subscription_payments")
      .update({
        status: "completed",
        pidx,
        payment_reference: khaltiData.transaction_id,
        paid_at: now,
      })
      .eq("id", paymentId);

    if (paymentUpdateError) throw paymentUpdateError;

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: payment.user_id,
        plan_id: payment.plan_id,
        status: "active",
        current_period_end: periodEnd.toISOString(),
        updated_at: now,
      }, { onConflict: "user_id" })
      .select()
      .single();

    if (subError) throw subError;

    return new Response(
      JSON.stringify({ message: "Subscription activated", subscription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : String(err)
    }), { status: 500, headers: corsHeaders });
  }
});
