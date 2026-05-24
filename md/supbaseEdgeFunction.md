Supabase edge function is just a small backend API function that runs on Supabase servers.

Think of it like: 
React app - runs on the browser
Edge function - runs on server, handles backend logic

Example cases in mine:

When invoice is sent - i need to send emails + update status

That logic should not run in React.


So we put that in a edge function.

send-invoice-email function 

What is deno?

Deno is just a runtime like Node.js

Why edge function exists?

Because supabase itself is Not a backend server.
it is a db, auth, storage. 
But not sending email, payment logic, complex workflow.

Edge function fills that gap.

React -> Supabase DB -> Edge function -> Email service(Resend / Sendgrid)

My flow should be:

Click send Invoice
Call backend function
Backend - update status = sent
- send emails
- genreate portal link

An edge function is just (req)=> res

like express app.post('/send-email', (req, res)=> {

})

fetch('/send-invoice-email, {
    method: 'POST',
    body: JSON.stringify({invoice_id})
})

What happens inside of that function

- Get invoice from db
get client email
genrate portal link
send email
 update status = sent

Forget other things,
edge function = Backend button handler

what we will build:
Create send invoice API function
(No emails yet - just console log)

Connect it to send invoice button

Add email service (Resend)

Update invoice status properly.