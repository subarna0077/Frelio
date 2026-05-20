import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useDeleteProject = () => {
    const queryClient = useQueryClient()

    const deleteProject = async (projectId?: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', projectId)

        if (error) throw error;
    }

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['projects']
            })
            queryClient.invalidateQueries({
                queryKey: ['clients']
            })
        }
    })
}