export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
import type { Client } from "../../clients/types/types"

export interface InvoiceItems {
    id: string,
    invoice_id: string,
    description: string,
    amount: number,
}


export interface Invoice {
    id: string,
    user_id: string,
    client_id: string,
    project_id: string,
    invoice_number: string,
    status: InvoiceStatus,
    due_date: string,
    created_at: string,
    clients: Pick<Client, 'name'| 'id' | 'address' > | null,
    total: number,
    invoice_items: InvoiceItems[]
}


