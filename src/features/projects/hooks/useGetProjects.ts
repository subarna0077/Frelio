import {useQuery} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type { Project } from '../types/types'

export const useGetProjects = ()=>{

    const user = useAuthStore(state=> state.user)

    const getProjects = async ()=>{
        const {data: projects, error} = await supabase.from('projects').select('* , milestones(*), clients(*)').eq('user_id', user?.id);
        if(error) throw error;
        // why we throw here and no return
        return projects ?? [];
    }

    return useQuery<Project []>({
        queryKey: ['projects'],
        queryFn: getProjects,
        
    })
}