import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useVerifySubscriptionPayment = () => {
    const qc = useQueryClient()

    const verify = async ({ pidx, paymentId }: { pidx: string, paymentId: string }) => {
        const { data, error } = await supabase.functions.invoke('subscription-verify', {
            body: { pidx, paymentId }
        })

        if (error) throw error
        return data
    }

    return useMutation({
        mutationFn: verify,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['subscription'] })
        }
    })
}
