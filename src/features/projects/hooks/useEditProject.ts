import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase';
import type{ ProjectDataType } from '../types/types';


export const useEditProject = (project_id?: string) => {

    const queryClient = useQueryClient();

    const editProject = async (data: ProjectDataType) => {
        const {} = await supabase.from('projects').update({
            ...data   
        }).eq('id', project_id)

    }

    return useMutation({
        mutationFn: editProject,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ['projects']
        })

    })
}