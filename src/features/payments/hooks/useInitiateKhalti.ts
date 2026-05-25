import {useMutation} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'


interface KhaltiPayload {
    amount: number,
    purchaseOrderId: string,
    purchaseOrderName: string
}

export const useInitiateKhalti = ()=> {

    const initiateKhalti = async ({amount, purchaseOrderId, purchaseOrderName}: KhaltiPayload)=> {

        const {data, error} = await supabase.functions.invoke('khalti-initiate', {
            body: {
                amount,
                purchaseOrderId,
                purchaseOrderName
            }
        });

        if(error) throw error;
        console.log(error)
        return data;
    }

    return useMutation({
        mutationFn: initiateKhalti,
        onSuccess: (data)=> {
            window.location.href = data.payment_url;
        }

    })


   
}