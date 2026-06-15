import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase';
import type { ProjectDataType } from '../types/types';



export const useEditProject = (project_id?: string) => {

    const queryClient = useQueryClient();

    const editProject = async (data: ProjectDataType) => {
        const { data: editedData, error } = await supabase.from('projects').update({
            ...data
        }).eq('id', project_id).select().single()

        if (error) throw new Error(error.message)

        return editedData;

    }

    return useMutation({
        mutationFn: editProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['project', project_id]
            })

            queryClient.invalidateQueries({
                queryKey: ['clients']
            })
        }
    })
}