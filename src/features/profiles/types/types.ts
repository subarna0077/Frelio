
export type Currency = 'NPR' | 'USD'

export interface Profile {
    id: string,
    full_name: string,
    username?: string,
    phone?: string,
    business_name?: string,
    pan_number?: string,
    currency: Currency,
    avatar_url?: string,
    created_at: string,
}