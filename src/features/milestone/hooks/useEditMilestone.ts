import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { MilestoneFormType } from '../types/types'

export const useEditMilestone = (milestone_id: string | undefined)=>{

    const queryClient = useQueryClient()

    const editMilestone = async (milestoneData: MilestoneFormType)=>{

        if(!milestone_id) {
            throw new Error('Milestone id is missing')
        }

        const {data, error} = await supabase.from('milestones').update({
            ...milestoneData
        }).eq('id', milestone_id).select().single()

        if(error) throw error;
        console.log(data)
        return data;
    }

    return useMutation({
        mutationFn: editMilestone,
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ['milestones']
            })

            console.log('edited successfully')
        }
    })
}