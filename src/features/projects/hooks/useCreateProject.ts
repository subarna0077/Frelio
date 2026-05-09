import {useMutation} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { ProjectDataType } from '../types/types'
import { useAuthStore } from '../../auth/stores/authStore'

export const useCreateProject = (clientID: string) => {
    const user = useAuthStore(state=> state.user);
   
    const createProject = async (data: ProjectDataType)=> {
        const {data: projectData, error} = await supabase.from('projects').insert({
            ...data,
            // when we dont use ? we get possibly null why is that - be clear on that
            user_id: user?.id,
            client_id: clientID
        }).select().single()

        if(error) throw error;
        return projectData;
    }

    return useMutation({
        mutationFn: createProject,
        onSuccess: (data)=> {
            console.log(data)
        },
        onError: (error)=> {
            console.log(error)
        }
    })

}