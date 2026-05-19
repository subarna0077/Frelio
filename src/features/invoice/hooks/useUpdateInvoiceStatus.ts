import { supabase } from "../../../lib/supabase";
import { useMutation, useQueryClient } from '@tanstack/react-query'


export const useUpdateInvoiceStatus = () => {

    const queryClient = useQueryClient()

    const updateInv = async ({ id, status }: { id: string, status: string }) => {
        const { data, error } = await supabase.from('invoices').update({
            status: status
        }).eq('id', id).select().single();

        if (error) throw new Error(error.message);
        return data;
    }

    return useMutation({
        mutationFn: updateInv,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['invoices']
            })

        }
    })


}