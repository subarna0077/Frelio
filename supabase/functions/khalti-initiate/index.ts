import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";
import { corsHeaders } from '../_shared/cors.ts'



Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {id, amount, purchaseOrderId, purchaseOrderName } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const khaltiKey = Deno.env.get('KHALTI_SECRET_KEY')

    if(!khaltiKey) {
      return new Response(
        JSON.stringify({
          error: 'Khalti secret key is not configured'
        }), {status: 500, headers: {...corsHeaders, 'Content-Type': 'application/json'}}
      )
    }


    const response = await fetch('https://dev.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${khaltiKey}`
      },
      body: JSON.stringify({
        return_url: `${Deno.env.get("FRONTEND_URL")}/portal/${id}/payment-success`,
        amount: amount,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: purchaseOrderName,
        website_url: `${Deno.env.get("FRONTEND_URL")}`

      })
    })

    if(!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify({detail: error.detail ?? 'Khalti error'}),
        {status: response.status, headers: {...corsHeaders, 'Content-Type': 'application/json'}}
      )
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {headers: {...corsHeaders, 'Content-Type': 'application/json'}}
    )

  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : String(err)
    }), {status: 500, headers: corsHeaders})
  }
});