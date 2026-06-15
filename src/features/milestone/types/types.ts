import { z } from 'zod'


export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'paid' | 'cancelled'


export type Milestone = {
    id: string;
    project_id: string;
    user_id: string;
    title: string;
    amount: number;
    due_date: string | null; // we used date as string because supabase returns data in json format which dont have date type
    completed_at: string | null;
    created_at: string;
    order_index: number | null;
    invoice_id: string | null;
    status: MilestoneStatus;
    description: string | null
}

export const MilestoneAddSchema = z.object({
    title: z.string().min(1, 'Milestone name is required'),
    description: z.string().min(20, 'Enter a short description of this milestone').optional(),
    amount: z.number().min(0, 'Amount must be positive'),
    due_date: z.string().optional()
})

export type MilestoneFormType = z.infer<typeof MilestoneAddSchema>