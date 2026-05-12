import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useDeleteMilestone = () => {
    const queryClient = useQueryClient()

    const deleteMilestone = async (milestoneId: string) => {
        const { error } = await supabase.from('milestones').delete().eq('id', milestoneId);
        if (error) throw error;
    }

    return useMutation({
        mutationFn: deleteMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['milestones']
            })
        }
    })
}