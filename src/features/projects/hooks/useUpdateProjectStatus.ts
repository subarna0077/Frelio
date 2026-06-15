import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { ProjectStatus } from '../types/types'


export const useUpdateProjectStatus = (project_id: string) => {
    console.log(project_id)
    const qc = useQueryClient();
    const updateProject = async (status: ProjectStatus) => {
        const { data, error } = await supabase.from('projects').update({
            'status': status
        }).select().eq('id', project_id);

        if (error) throw error;
        console.log(error)
        return data;
    }

    return useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['project', project_id]
            })
        }
    })
}