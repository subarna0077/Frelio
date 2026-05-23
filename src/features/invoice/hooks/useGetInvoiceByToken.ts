import { supabase } from "../../../lib/supabase"
import { useQuery } from '@tanstack/react-query'

export const useGetInvoiceByToken = (token: string) => {

    const getInvByToken = async () => {
        const { data, error } = await supabase.from('invoices').
            select('*, clients(*), projects(*), invoice_items(*)').eq('public_token', token).single();

        if (error) throw new Error(error.message);
        return data;
    }

    return useQuery({
        queryFn: getInvByToken,
        queryKey: ['invoice', 'portal', token]
    })


}