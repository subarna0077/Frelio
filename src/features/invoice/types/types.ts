export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'viewed' | 'partially_paid' | 'cancelled' 
import type { Client } from "../../clients/types/types"
import type { Milestone } from "../../milestone/types/types";
import type { Project } from "../../projects/types/types";


export type SenderSnapShot = {
    name: string
    email: string | null
    address: string | null
    pan_number: string | null

}

export type ClientSnapShot = {
    name: string
    email: string | null
    address: string | null
    pan_number: string | null

}

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
    due_date: string,
    created_at: string,
    sent_at: string | null,
    viewed_at: string | null,
    milestone_id: string,
    status: InvoiceStatus,

    //payment fields
    paid_at: string| null;
    payment_method: 'khalti' | 'esewa' | 'bank' | 'cash' | null;
    payment_reference: string | null;  // khalti's pidx goes here

    //invoice content
    total: number;
    notes: string | null;

    public_token: string,

    sender_snapshot: SenderSnapShot | null,
    client_snapshot: ClientSnapShot | null,
    tax: number | null,
    subtotal: number | null,
    amount_paid: number | null,
    amount_due: number | null,



   
    clients: Pick<Client, 'name'| 'id' | 'address' | 'phone' | 'email' > | null,
    projects: Pick<Project, 'id' | 'title' | 'status'> | null,
    invoice_items: InvoiceItems[],
    milestones?: Milestone

    
   

   
   
}


