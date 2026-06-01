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

        // here we are using service role key . using service role key provide access
        // to the whole db. and can read write. It typically disable the rls, that mean
        // it can update the whole db by itself without requiring the id and stuffs.

        // When creating the rls for invoices we have,
        //  set the rls to that only logged in user can access their own data. others cant.

        const now = new Date().toISOString();

        const { data: overdueInvoices, error } = await supabase
            .from("invoices").select("*, clients(*), projects(*)").in("status", ['sent', 'viewed']).lt("due_date", new Date().toISOString());

        if (error) throw error; // check error immediately.

        for (const invoice of overdueInvoices) {

            const portalLink = `https://frelio.vercel.app/portal/${invoice.public_token}`
            await supabase.from("invoices").update({ status: "overdue" }).eq("id", invoice.id);

            await fetch("https://api.brevo.com/v3/smtp/email", {
                method: 'POST',
                headers: {
                    "api-key": Deno.env.get("BREVO_API_KEY")!,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender: { name: "Frelio", email: "sumansapkota0099@gmail.com" },
                    to: [{ email: invoice.clients.email, name: invoice.clients.name }],
                    subject: `Invoice #${invoice.invoice_number}`,
                    htmlContent: `
                        <p> The invoice #${invoice.invoice_number} has not been paid yet.Kindly do the payment by today to avoid fine. </p>
                        <a href="${portalLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; text-align: center;" > View invoice</ a >

                    `
                })

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