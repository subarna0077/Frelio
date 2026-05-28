import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export const useVerifyPayment = () => {

    const verifyPayment = async ({pidx, orderId}: {pidx: string, orderId: string}) => {

        const { data, error } = await supabase.functions.invoke('verify_payment', {
            body: {
                pidx: pidx,
                orderID: orderId
            }
        });

        if (error) throw error;
        return data;
    }

    return useMutation({
        mutationFn: verifyPayment,
        onSuccess: (data)=> {
            console.log(data);
        }
    })
}