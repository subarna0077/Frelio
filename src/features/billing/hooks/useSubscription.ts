import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../auth/stores/authStore'
import { fetchPlans } from '../api/fetchPlans'
import { fetchMySubscription } from '../api/fetchMySubscription'
import type { Plan } from '../types/types'

const FREE_PLAN_ID = 'free'

// A user with no row in `subscriptions` is on the free plan by default,
// or a paid subscription has lapsed past its current_period_end.
const isExpired = (currentPeriodEnd: string | null) =>
    !!currentPeriodEnd && new Date(currentPeriodEnd).getTime() < Date.now()

export const useSubscription = () => {
    const user = useAuthStore(state => state.user)

    const plansQuery = useQuery<Plan[]>({
        queryKey: ['plans'],
        queryFn: fetchPlans,
        staleTime: 5 * 60 * 1000,
    })

    const subscriptionQuery = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: () => fetchMySubscription(user!.id),
        enabled: !!user?.id,
    })

    const plans = plansQuery.data ?? []
    const subscription = subscriptionQuery.data ?? null

    const lapsed = subscription?.status === 'active' && isExpired(subscription.current_period_end)
    const activePlanId = subscription && subscription.status === 'active' && !lapsed
        ? subscription.plan_id
        : FREE_PLAN_ID

    const plan = plans.find(p => p.id === activePlanId) ?? plans.find(p => p.id === FREE_PLAN_ID) ?? null

    return {
        plan,
        plans,
        subscription,
        isLoading: plansQuery.isLoading || subscriptionQuery.isLoading,
    }
}
