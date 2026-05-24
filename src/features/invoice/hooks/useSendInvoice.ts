import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export const useSendInvoice = () => {
    const qc = useQueryClient();

    const sendInvoice = async (invoiceId: string) => {

        const { data, error } = await supabase.functions.invoke('send-invoice-email', {
            body: {
                invoice_id: invoiceId
            }
        })
        if (error) throw new Error(error.message);
        return data;

    }

    return useMutation({
        mutationFn: sendInvoice,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["invoices"] });
        },
        onError: (err) => {
            console.log("Send invoice error:", err);
        },
    });
};