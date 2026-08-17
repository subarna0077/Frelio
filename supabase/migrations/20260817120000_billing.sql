-- Billing: subscription plans for Frelio itself (not client invoices).
-- A user with no row in `subscriptions` is treated as being on the 'free' plan
-- by the application layer, so this migration does not need a signup trigger.

create table if not exists plans (
    id text primary key,                       -- 'free' | 'pro' | 'agency'
    name text not null,
    price_npr numeric not null default 0,
    billing_interval text not null default 'month' check (billing_interval in ('month', 'year')),
    max_clients int,                            -- null = unlimited
    max_invoices_per_month int,                 -- null = unlimited
    remove_branding boolean not null default false,
    sort_order int not null default 0,
    created_at timestamptz not null default now()
);

insert into plans (id, name, price_npr, max_clients, max_invoices_per_month, remove_branding, sort_order)
values
    ('free', 'Free', 0, 3, 5, false, 0),
    ('pro', 'Pro', 999, null, null, true, 1)
on conflict (id) do nothing;

create table if not exists subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade unique,
    plan_id text not null references plans(id) default 'free',
    status text not null default 'active' check (status in ('active', 'pending', 'expired', 'cancelled')),
    current_period_end timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists subscription_payments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    plan_id text not null references plans(id),
    amount numeric not null,
    status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
    pidx text,
    payment_reference text,
    created_at timestamptz not null default now(),
    paid_at timestamptz
);

create index if not exists subscription_payments_user_id_idx on subscription_payments(user_id);

alter table plans enable row level security;
alter table subscriptions enable row level security;
alter table subscription_payments enable row level security;

-- Plans are public pricing info.
create policy "plans_select_all" on plans
    for select using (true);

-- Users can only see/manage their own subscription. Row updates that flip
-- status/plan_id to active happen via the service-role edge function.
create policy "subscriptions_select_own" on subscriptions
    for select using (auth.uid() = user_id);

create policy "subscriptions_insert_own" on subscriptions
    for insert with check (auth.uid() = user_id);

-- Users can create and read their own payment attempts; only the edge
-- function (service role) marks them completed.
create policy "subscription_payments_select_own" on subscription_payments
    for select using (auth.uid() = user_id);

create policy "subscription_payments_insert_own" on subscription_payments
    for insert with check (auth.uid() = user_id);
