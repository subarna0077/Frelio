import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts'



Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invoice_id, public_token } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date().toISOString();

    const {data: existingInvoice, error: fetchError} = await supabase.from('invoices').select("*, clients(*)").eq("id", invoice_id).single();

    if(fetchError) throw fetchError

    const {data: profile, error: profileError} = await supabase.from("profiles").select("full_name, phone").eq("id", existingInvoice.user_id).single()

    if(profileError) throw profileError;

    const client_snapshot = {
      name: existingInvoice.clients.name ?? null,
      email: existingInvoice.clients.email ?? null,
    }

    const sender_snapshot = {
      name: profile?.full_name ?? null,
    };

    const { data: updatedInvoice, error: updatedError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: now,
        client_snapshot,
        sender_snapshot
      })
      .eq("id", invoice_id)
      .select("*, clients(*)")
      .single();

    if (updatedError) throw updatedError;

    const portalLink = `${Deno.env.get('FRONTEND_URL')}/portal/${public_token}`;

    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": Deno.env.get("BREVO_API_KEY")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Frelio", email: "sumansapkota0099@gmail.com" },
        to: [{ email: updatedInvoice.clients.email, name: updatedInvoice.clients.name }],
        subject: `Invoice #${updatedInvoice.invoice_number}`,
        htmlContent: `
      <h2>Hi ${updatedInvoice.clients.name}</h2>
      <p>Please find your invoice below</p>
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
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json()
      throw new Error(JSON.stringify(emailError))
    }


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