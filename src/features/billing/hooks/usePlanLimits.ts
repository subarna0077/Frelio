import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import { useSubscription } from './useSubscription'

// Reads counts straight from Supabase (head + count, no rows transferred)
// rather than piggy-backing on useGetClients/useGetInvoices, so the limit
// check works even on pages that haven't fetched those lists yet.
const useMonthlyUsage = () => {
    const user = useAuthStore(state => state.user)
    const monthStart = dayjs().startOf('month').toISOString()

    return useQuery({
        queryKey: ['plan-usage', user?.id, monthStart],
        enabled: !!user?.id,
        queryFn: async () => {
            const [{ count: clientCount, error: clientErr }, { count: invoiceCount, error: invoiceErr }] = await Promise.all([
                supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
                supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('user_id', user!.id).gte('created_at', monthStart),
            ])

            if (clientErr) throw clientErr
            if (invoiceErr) throw invoiceErr

            return {
                clientCount: clientCount ?? 0,
                invoiceCountThisMonth: invoiceCount ?? 0,
            }
        },
    })
}

export const usePlanLimits = () => {
    const { plan, isLoading: planLoading } = useSubscription()
    const { data: usage, isLoading: usageLoading } = useMonthlyUsage()

    const clientCount = usage?.clientCount ?? 0
    const invoiceCountThisMonth = usage?.invoiceCountThisMonth ?? 0

    const clientLimitReached = !!plan?.max_clients && clientCount >= plan.max_clients
    const invoiceLimitReached = !!plan?.max_invoices_per_month && invoiceCountThisMonth >= plan.max_invoices_per_month

    return {
        plan,
        clientCount,
        invoiceCountThisMonth,
        clientLimitReached,
        invoiceLimitReached,
        canCreateClient: !clientLimitReached,
        canCreateInvoice: !invoiceLimitReached,
        isLoading: planLoading || usageLoading,
    }
}
