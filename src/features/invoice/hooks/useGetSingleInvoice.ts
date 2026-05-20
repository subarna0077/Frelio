import { supabase } from "../../../lib/supabase";
import {useQuery} from '@tanstack/react-query'
import {useParams} from 'react-router-dom'
import type{ Invoice } from "../types/types";
export const useGetSingleInvoice = ()=>{


    const {id} = useParams<{id: string}>(); // be clear about this too.

    const getSingleInvoice = async ()  => {

        const {data, error} = await supabase.from('invoices').select('*, invoice_items(*), clients(*) ').eq('id', id).single();

        if(error) throw new Error(error.message)

        return data;
    }

    return useQuery<Invoice>({
        queryFn: getSingleInvoice,
        queryKey: ['invoice', id],
        enabled: !!id
    })


}