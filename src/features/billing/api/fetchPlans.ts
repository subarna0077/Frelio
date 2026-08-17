import { supabase } from "../../../lib/supabase"
import type { Plan } from "../types/types"

export const fetchPlans = async (): Promise<Plan[]> => {
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) throw error
    return data
}
