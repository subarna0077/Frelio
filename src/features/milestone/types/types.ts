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