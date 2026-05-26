import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'

// http://localhost:5173/payment-success?orderID=7b891905-c7d9-4068-b3d1-7294e9ed99b3&pidx=mBrJM3YzR6XVS8PiHAx2Uc&transaction_id=nt95dmQczBHw3Cjw4NSVeW&tidx=nt95dmQczBHw3Cjw4NSVeW&txnId=nt95dmQczBHw3Cjw4NSVeW&amount=20202&total_amount=20202&mobile=98XXXXX003&status=Completed&purchase_order_id=7b891905-c7d9-4068-b3d1-7294e9ed99b3&purchase_order_name=Subarna+Sapkota

// In success url, we get pidx, status = success

/*

The callback will return the success response

{
   "pidx": "HT6o6PEZRWFJ5ygavzHWd5",
   "total_amount": 1000,
   "status": "Completed",
   "transaction_id": "GFq9PFS7b2iYvL8Lir9oXe",
   "fee": 0,
   "refunded": false
}



*/





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

        const data = await response.json();

        if (data.status !== "Completed") {
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
                payment_reference: data.transaction_id,
                paid_at: now,
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