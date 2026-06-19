import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import type { InvoiceFormType } from '../components/InvoiceModalForm'


type CreateInvoicePayload = InvoiceFormType & {
  subtotal: number
  tax: number
  total: number
}

export const useCreateInvoice = (client_id?: string, project_id?: string) => {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)

  const createInvoice = async (data: CreateInvoicePayload) => {

    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id)

    const invoiceNumber = `INV-${String((count ?? 0) + 1).padStart(3, '0')}`

  
    // create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user?.id,
        client_id,
        project_id,
        milestone_id: data.milestone_id,   
        invoice_number: invoiceNumber,                
        status: 'draft',               
        due_date: data.due_date || null,
        notes: data.notes || null,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        amount_due: data.total,            
        amount_paid: 0,
        public_token: crypto.randomUUID(),
        
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    
    const items = data.items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      amount: item.amount,
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items)

    if (itemsError) throw itemsError

    return invoice
  }

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['project', project_id] })
      queryClient.invalidateQueries({
        queryKey: ['client'],
        exact: false,
      })
    }
  })
}