export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'cancelled'

export interface Plan {
    id: string,
    name: string,
    price_npr: number,
    billing_interval: 'month' | 'year',
    max_clients: number | null,
    max_invoices_per_month: number | null,
    remove_branding: boolean,
    sort_order: number,
}

export interface Subscription {
    id: string,
    user_id: string,
    plan_id: string,
    status: SubscriptionStatus,
    current_period_end: string | null,
    created_at: string,
    updated_at: string,
}

export interface SubscriptionPayment {
    id: string,
    user_id: string,
    plan_id: string,
    amount: number,
    status: 'pending' | 'completed' | 'failed',
    pidx: string | null,
    payment_reference: string | null,
    created_at: string,
    paid_at: string | null,
}
