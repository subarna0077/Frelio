import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { pidx, orderID } = await req.json();

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const khaltiKey = Deno.env.get('KHALTI_SECRET_KEY')

        if (!khaltiKey) {
            return new Response(
                JSON.stringify({
                    error: 'Khalti secret key is not configured'
                }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }


        const response = await fetch('https://dev.khalti.com/api/v2/epayment/lookup/', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${khaltiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pidx
            })
        });


        if (!response.ok) {
            const error = await response.json()
            return new Response(
                JSON.stringify({ detail: error.detail ?? 'Khalti error' }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const khaltiData = await response.json();
        console.log(khaltiData)

        if (khaltiData.status !== "Completed") {
            return new Response(JSON.stringify({ message: "Payment Not completed", data }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const now = new Date().toISOString();


        const { data: updatedInvoice, error } = await supabase
            .from("invoices")
            .update({
                payment_method: "khalti",
                payment_reference: khaltiData.transaction_id,
                paid_at: now,
                status: 'paid',
            })
            .eq("id", orderID)
            .single();

        if (error) throw error;

        return new Response(
            JSON.stringify({
                message: "Payment is completed.",
                invoice: updatedInvoice,
            }),
            {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                error: err instanceof Error ? err.message : String(err),
            }),
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
});