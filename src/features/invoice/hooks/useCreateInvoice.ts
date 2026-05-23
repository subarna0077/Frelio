import {useMutation, useQueryClient} from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type{ InvoiceFormType } from '../components/InvoiceModalForm'

export const useCreateInvoice = (client_id?: string, project_id?: string)=>{

    const queryClient = useQueryClient()

    const user = useAuthStore(state=> state.user)

    const createInvoice = async(data: InvoiceFormType)=>{

        const total = data.items.reduce((sum, item)=> sum + item.amount, 0)

        const {count} = await supabase.from('invoices').select('*', {
            count: 'exact', head: true
        }).eq('user_id', user?.id)

        const invoiceNumber = `INV-${String((count ?? 0) + 1).padStart(3, '0')}`

        const {data: invoice, error: invoiceError} = await supabase.from('invoices').insert({
            user_id: user?.id,  
            client_id,
            project_id,
            total,
            invoice_number: invoiceNumber,
            status: 'draft',
            due_date: data.due_date,
            public_token: crypto.randomUUID(),
        }).select().single()

        if (invoiceError) throw invoiceError;
    


        const items = data.items.map(item=> ({
            invoice_id: invoice.id,
            description: item.description,
            amount: item.amount
        }))

        const {error} = await supabase.from('invoice_items').insert(items);

        if(error) throw error;

        return invoice;

    }


    return useMutation({
        mutationFn: createInvoice,
        onSuccess: ()=> {
            queryClient.invalidateQueries({
                queryKey: ['invoices']
            })

            console.log('Invoice created succesffuly')

        }
    })



}