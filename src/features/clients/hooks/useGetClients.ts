
/*
purpose of this function is to get all the clients of the user who is currently logged in


when we do the supabase.from('clients').select(*).eq('user_id', user?.id)
here user is the currently logged in user stored in useAuthStore, so by accessing the id, we can filter the clients with the currently logged in userid

This will give us the list of clients which we can use to display in the 
dropdown of the projects section.


*/


import {useQuery} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type { Client } from '../types/types'

export const useGetClients = ()=>{

    const user = useAuthStore(state=> state.user)

    const getClient = async()=> {
        // in order to get the clients of the curren
        const {data, error} = await supabase.from('clients').select('*').eq('user_id',user?.id)
        if(error) throw error;
        return data;

    }

    return useQuery<Client[]>({
        queryFn: getClient,
        queryKey: ['clients'],
    })
}