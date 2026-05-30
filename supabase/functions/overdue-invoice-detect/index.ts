import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { invoice_id } = await req.json();

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

        const now = new Date().toISOString();

        const { data: invoiceData, error } = await supabase
            .from("invoices").select()
            .eq("id", invoice_id).single();

        if (error) throw error; // check error immediately.

        console.log('status', invoiceData.status)
        console.log('due', invoiceData.due_date)
        console.log(now)
        console.log("is overdue", new Date(invoiceData.due_date) < new Date(now))



        if (invoiceData.status === 'paid') {
            return new Response(
                JSON.stringify({
                    message: 'This invoice is already paid.',
                    invoice: invoiceData
                }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (invoiceData.status === 'sent' && new Date(invoiceData.due_date) < new Date(now)) {

            const { data: updatedInv, error: updatedErr } = await supabase.from("invoices").update({
                status: 'overdue'
            }).eq('id', invoice_id).select('*, clients(*), projects(*)').single();

            if (updatedErr) throw updatedErr;

            const portalLink = `${Deno.env.get("FRONTEND_URL")}/portal/${updatedInv.public_token}`;

            const { error: emailError } = await resend.emails.send({
                from: 'Invoice app <onboarding@resend.dev>',
                to: updatedInv.clients.email,
                subject: `Reminder for payment of invoice #${updatedInv.invoice_number}`,
                html: `
                <h2> Hi ${updatedInv.clients.name} </h2>
                <p> The payment of the project ${updatedInv.projects.title} is not completed yet. Kindly complete the payment soon. </p>
                <p> Please find your invoice below </p>
                 <a href="${portalLink}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: #000;
                    color: #fff;
                    border-radius: 6px;
                    text-decoration: none;
                    ">
                    View Invoice
                </a>
                `
            })

            if (emailError) throw emailError;


            return new Response(
                JSON.stringify({
                    message: 'This invoice has crossed its due date.',
                    invoice: updatedInv
                }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({
                message: `This invoice is within the due date guideline`,
                invoice: invoiceData
            }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

        if (error) throw error;
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