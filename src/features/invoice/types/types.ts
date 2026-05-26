export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
import type { Client } from "../../clients/types/types"
import type { Project } from "../../projects/types/types";

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
    sent_at: string,
    viewed_at: string

    //payment fields
    paid_at: string| null;
    payment_method: 'khalti' | 'esewa' | 'bank' | 'cash' | null;
    payment_reference: string | null;  // khalti's pidx goes here


    //invoice content
    total: number;
    notes: string | null;

    //joined relations
    clients: Pick<Client, 'name'| 'id' | 'address' > | null,
    projects: Pick<Project, 'id' | 'title'> | null,
    invoice_items: InvoiceItems[],

    //portal
    public_token: string,
    
}


