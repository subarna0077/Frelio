import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useDeleteClient = () => {

    const queryClient = useQueryClient()
    const deleteClient = async (id: string) => {
        const { error } = await supabase.from('clients').delete().eq('id', id)
        if (error) throw error;
    }

    
    return useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['clients']
            })
        }
    })

}