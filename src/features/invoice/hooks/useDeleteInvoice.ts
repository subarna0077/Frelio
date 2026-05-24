import { supabase } from "../../../lib/supabase";
import {useMutation, useQueryClient} from '@tanstack/react-query'


export const useDeleteInvoice = ()=> {

    const qc = useQueryClient();

    const deleteInv = async (id: string)=> {
        const {data, error} = await supabase.from('invoices').delete().eq('id', id);

        if (error) throw error;

        return data;

    }

    return useMutation({
            mutationFn: deleteInv,
            onSuccess: ()=> {
                qc.invalidateQueries({
                    queryKey: ['invoices']
                })
            }
        })   
}