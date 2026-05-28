import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";
import {corsHeaders} from '../_shared/cors.ts'



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

    const { data: updatedInvoice, error: updatedError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: now,
      })
      .eq("id", invoice_id)
      .select("*, clients(*)")
      .single();

    if (updatedError) throw updatedError;

    const portalLink = `${Deno.env.get('FRONTEND_URL')}/portal/${invoice_id}`;

    const { error: emailError } = await resend.emails.send({
      from: 'Invoice app <onboarding@resend.dev>',
      to: updatedInvoice.clients.email,
      subject: `Invoice #${updatedInvoice.invoice_number}`,
      html: `
      <h2> Hi ${updatedInvoice.clients.name} </h2>
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

    if(emailError) throw emailError;


    return new Response(
      JSON.stringify({
        message: "Invoice marked as sent",
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