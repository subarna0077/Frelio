import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Client } from '../types/types'

export const useGetSingleClient = (clientId: string) => {
    const getClient = async (): Promise<Client> => {
        const { data, error } = await supabase
            .from('clients')
            .select(`
                *,
                projects (
                    id,
                    title,
                    status,
                    start_date,
                    milestones (
                        id,
                        amount,
                        status
                    )
                ),
                invoices (
                    id,
                    invoice_number,
                    total,
                    status,
                    created_at,
                    due_date,
                    sent_at,
                    paid_at
                )
            `)
            .eq('id', clientId)
            .single()

        if (error) throw error
        return data
    }

    return useQuery<Client>({
        queryKey: ['client', clientId],
        queryFn: getClient,
        enabled: !!clientId,
    })
}