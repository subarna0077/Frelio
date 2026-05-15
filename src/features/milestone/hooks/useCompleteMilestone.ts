import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useCompleteMilestone = ()=>{

    const queryClient = useQueryClient()

    const completeMilestone = async (milestone_id: string)=>{

        if(!milestone_id) {
            throw new Error('Milestone id is missing')
        }

        const {data, error} = await supabase.from('milestones').update({
            is_completed: true,
            completed_at: new Date()
        }).eq('id', milestone_id).select().single()

        if(error) throw error;
        console.log(data)
        return data;
    }

    return useMutation({
        mutationFn: completeMilestone,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ['milestones']
            })

            console.log('edited successfully')
        }
    })
}