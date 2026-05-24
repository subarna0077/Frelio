When we write the react code, it runs in the browser, which means anyone can open devtools and see the code. So you cannot put secret API keys like resend key there.

WE need a server to hold the secrets and make sensitibe calls. Supabase gives you that server via edge functions, and those edge functions runs on deno not node js
