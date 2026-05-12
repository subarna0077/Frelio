import { z } from 'zod'

export type Milestone = {
    id: string;
    project_id: string;
    user_id: string;
    name: string;
    amount: number;
    due_date: string | null; // we used date as string because supabase returns data in json format which dont have date type
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
}

export const MilestoneAddSchema = z.object({
    name: z.string().min(1, 'Milestone name is required'),
    amount: z.number().min(0, 'Amount must be positive'),
    due_date: z.string().optional()
})

export type MilestoneFormType = z.infer<typeof MilestoneAddSchema>