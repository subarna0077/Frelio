import {useQuery} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Project } from '../types/types'

export const useGetSingleProject = (projectId?: string)=>{

    const getSingleProject = async ()=>{
        const {data, error} = await supabase.from('projects').
        select(`* , clients (
            id,
            name,
            phone,
            address
            )`).eq('id', projectId).single()

        if(error) throw error;
        return data;
    }

    return useQuery<Project>({
        queryFn: getSingleProject,
        queryKey: ['project', projectId],
        enabled: !!projectId
    })
}