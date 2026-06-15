import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { MilestoneStatus } from '../types/types'

export const useUpdateMilestoneStatus = () => {
    const queryClient = useQueryClient()

    const updateMilestone = async ({milestoneId, status, invoiceId}: {milestoneId: string, status: MilestoneStatus, invoiceId?: string}) => {
        const {data, error } = await supabase.from('milestones').update({
            ...(invoiceId && {invoice_id: invoiceId}),
            status: status
        }).eq('id', milestoneId).select().single();
        if (error) throw error;
        console.log("Data from updating ms", data)
        return data;
    }

    return useMutation({
        mutationFn: updateMilestone,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['milestones']
            }),
            queryClient.invalidateQueries({
                queryKey: ['project', data.project_id]
            })
        }
    })
}