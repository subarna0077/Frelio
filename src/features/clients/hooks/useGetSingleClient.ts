import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { Client } from '../types/types'

export const useGetSingleClient = (clientId: string) => {
    const getClient = async (): Promise<Client> => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single()

        if (error) throw error
        return data
    }

    return useQuery<Client>({
        queryKey: ['clients', clientId],
        queryFn: getClient,
        enabled: !!clientId
    })
}