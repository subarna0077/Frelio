import {useQuery} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Province } from '../types/types';


export const useGetProvince = ()=>{

    const getProvince = async()=> {
        const {data, error} = await supabase.from('provinces').select('*');

        if(error) throw error;
        console.log(data, error)

        return data;
    }

    return useQuery<Province[]>({
        queryFn:  getProvince,
        queryKey: ['provinces']
      })
}