import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

        const now = new Date().toISOString();

        const { data: overdueInvoices, error } = await supabase
            .from("invoices").select("*, clients(*), projects(*)").in("status", ['sent', 'viewed']).lt("due_date", new Date().toISOString());

        if (error) throw error; // check error immediately.

        // overdue invoices is a array

        // loop over a array using for of loop
        // for each of the invoice of array , change the status to overdue and send the mail


        for (const invoice of overdueInvoices) {

            const portalLink = `https://frelio.vercel.app/portal/${invoice.public_token}`
            await supabase.from("invoices").update({ status: "overdue" }).eq("id", invoice.id);

            await resend.emails.send({
                from: 'Frelio <onboarding@resend.dev>',
                to: invoice.clients.email,
                subject: `Overdue: Invoice #${invoice.invoice_number}`,
                html: `
        <p>The invoice #${invoice.invoice_number} has not been paid yet. Kindly do the payment by today to avoid fine. </p>
        <a href="${portalLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; text-align: center;">View invoice</a>

        `

            })
        }

        return new Response(
            JSON.stringify({ message: `Processed ${overdueInvoices.length} overdue invoices.` }),
            { headers: { ...corsHeaders, "Content-Type": 'application/json' } }
        )

    }
    catch (err) {
        return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
            { status: 500, headers: corsHeaders }
        )

    }



});