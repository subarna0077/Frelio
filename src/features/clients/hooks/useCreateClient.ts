import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import {type ClientFormType } from '../types/types'
import { useAuthStore } from '../../auth/stores/authStore'


export const useCreateClient = ()=>{

    const queryClient = useQueryClient()
    const user = useAuthStore(state=> state.user)
    
    const createClient = async(data: ClientFormType )=>{
        const {data: result, error} = await 
        supabase.from('clients').
        insert({
            ...data,
            user_id: user?.id 
        }).
        select().
        single()
        if(error) throw error;
        return result;
    }

    return useMutation({
        mutationFn: createClient,
        onSuccess:()=> {
            queryClient.invalidateQueries({
                queryKey:['clients']
            })
            
        }
    })




}
