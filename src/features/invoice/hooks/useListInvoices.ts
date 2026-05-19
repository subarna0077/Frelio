import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type { Invoice } from '../types/types'

export const useListInvoices = () => {

    const user = useAuthStore(state => state.user)

    const listInvoices = async () => {

        const { data, error } = await supabase.from('invoices').
            select(`*, clients(id, name, address)`).eq('user_id', user?.id);

        if (error) throw error;

        console.log(error, data)

        return data;
    }

    return useQuery<Invoice[]>({
        queryFn: listInvoices,
        queryKey: ['invoices', user?.id]
    })



}