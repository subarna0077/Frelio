import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type { Invoice } from '../types/types'

export const useListInvoices = () => {

    const user = useAuthStore(state => state.user)

    const listInvoices = async () => {

        const { data, error } = await supabase.from('invoices').
            select(`*, clients(id, name, address, email)`).eq('user_id', user?.id);
            // Since we have rls enabled, the eq part is redundant.
            // Keeping it is not harmful, but it is doing double filtering which is redundant.

        if (error) throw error;

        console.log(error, data)

        return data;
    }

    return useQuery<Invoice[]>({
        queryFn: listInvoices,
        queryKey: ['invoices', user?.id]
    })



}