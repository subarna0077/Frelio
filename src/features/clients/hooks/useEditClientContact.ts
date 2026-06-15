import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { EditContactType } from '../pages/ClientDetail'


export const useEditClientContact = (client_id: string)=> {
    const qc = useQueryClient()

    const editClientContact = async(data: EditContactType)=>{
        const {data: updatedData, error} = await supabase.from('clients').update({
            ...data

        }).eq('id', client_id).select();

        if(error) throw error;

        return updatedData;
    }

    return useMutation({
        mutationFn: editClientContact,
        onSuccess: ()=> {
            qc.invalidateQueries({
                queryKey: ['clients']
            })
        }
    })
}