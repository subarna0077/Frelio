import { supabase } from "../../../lib/supabase"


type payloadType = {
    address_line_1: string;
    city: string;
    district_id: number;
    address_line_2?: string | undefined;
}


export const createAddress = async(payload: payloadType)=>{

    const {data, error} = await supabase.from('addresses').insert(payload).select().single()
    if(error) throw error;
    return data;
}