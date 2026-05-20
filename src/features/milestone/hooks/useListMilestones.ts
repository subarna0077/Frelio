import {useQuery} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Milestone } from '../types/types'

export const useListMilestones = (project_id?: string)=>{
    const listMilestones = async ()=>{
        const {data, error} = await supabase.from('milestones').select('*').eq('project_id', project_id);
        if(error) throw error;
        return data;  
    }

    return useQuery<Milestone[]>({
        queryFn: listMilestones,
        queryKey: ['milestones', project_id],
        enabled: !!project_id
    })
}