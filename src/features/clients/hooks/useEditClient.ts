import { supabase } from "../../../lib/supabase";
import {useMutation, useQueryClient} from '@tanstack/react-query'
import type{ ClientFormType } from "../types/types";

export const useEditClient = ()=>{
    const qc = useQueryClient()


    const editClient = async ({id, formData}: {id: string; formData: ClientFormType})=>{
        const {data, error} = await supabase.from('clients').update({
            ...formData,
        }).eq('id', id).select().single();

        if (error) throw new Error(error.message);

        return data;
    }



    return useMutation({
        mutationFn: editClient,
        onSuccess: ()=>{
            qc.invalidateQueries({
                queryKey: ['clients']
            })

            console.log('Edited successfully.')
        }
    })
}