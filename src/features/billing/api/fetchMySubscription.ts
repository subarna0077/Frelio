import { supabase } from "../../../lib/supabase"
import type { Subscription } from "../types/types"

export const fetchMySubscription = async (userId: string): Promise<Subscription | null> => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error
    return data
}
