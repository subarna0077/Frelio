import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useInitiateSubscription = () => {
    const initiate = async (planId: string) => {
        const { data, error } = await supabase.functions.invoke('subscription-initiate', {
            body: { planId }
        })

        if (error) throw error
        return data
    }

    return useMutation({
        mutationFn: initiate,
        onSuccess: (data) => {
            window.location.href = data.payment_url
        }
    })
}
