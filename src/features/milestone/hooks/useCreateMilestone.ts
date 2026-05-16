import { type MilestoneFormType } from "../types/types";
import type{ Milestone } from "../types/types";
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../auth/stores/authStore";

export const useCreateMilestone = (project_id: string | undefined)=>{
    const {user} = useAuthStore()
    const queryClient = useQueryClient()

    const createMilestone = async (milestoneData: MilestoneFormType) : Promise<Milestone>=>{
        const {data, error} = await 
        supabase.from('milestones').
        insert({
            ...milestoneData,
            user_id: user?.id,
            project_id

        }).select().single()

        if( error) throw error;
        return data;

    }

    return useMutation<Milestone, Error, MilestoneFormType>({
        mutationFn: createMilestone,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['milestones', project_id]})
        }
    })
}