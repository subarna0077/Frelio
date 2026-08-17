import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material'
import { CheckRounded } from '@mui/icons-material'
import { useSubscription } from '../hooks/useSubscription'
import { useInitiateSubscription } from '../hooks/useInitiateSubscription'
import { toast } from 'react-hot-toast'

export const Billing = () => {
    const { plan: currentPlan, plans, isLoading } = useSubscription()
    const { mutate: initiateSubscription, isPending, variables: pendingPlanId } = useInitiateSubscription()

    const handleUpgrade = (planId: string) => {
        initiateSubscription(planId, {
            onError: (err) => toast.error(err instanceof Error ? err.message : 'Could not start payment'),
        })
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={24} />
            </Box>
        )
    }

    return (
        <Box sx={{ maxWidth: 780 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 0.5 }}>Billing</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 3 }}>
                You're currently on the <strong>{currentPlan?.name ?? 'Free'}</strong> plan.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {plans.map((plan) => {
                    const isCurrent = plan.id === currentPlan?.id
                    const isFree = plan.price_npr <= 0

                    return (
                        <Box
                            key={plan.id}
                            sx={{
                                flex: '1 1 240px',
                                border: '1px solid',
                                borderColor: isCurrent ? '#0F6E56' : 'divider',
                                borderRadius: 2,
                                p: 2.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{plan.name}</Typography>
                                {isCurrent && <Chip label="Current" size="small" sx={{ bgcolor: '#E1F5EE', color: '#0F6E56', fontSize: 11, height: 20 }} />}
                            </Box>

                            <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 1.5 }}>
                                {isFree ? 'Free' : `Rs. ${plan.price_npr}`}
                                {!isFree && <Typography component="span" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 400 }}> /{plan.billing_interval}</Typography>}
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2.5 }}>
                                <Feature text={plan.max_clients ? `Up to ${plan.max_clients} clients` : 'Unlimited clients'} />
                                <Feature text={plan.max_invoices_per_month ? `${plan.max_invoices_per_month} invoices / month` : 'Unlimited invoices'} />
                                {plan.remove_branding && <Feature text="Remove Frelio branding" />}
                            </Box>

                            <Button
                                fullWidth
                                disabled={isCurrent || isFree || (isPending && pendingPlanId === plan.id)}
                                onClick={() => handleUpgrade(plan.id)}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: 13,
                                    bgcolor: isCurrent ? 'action.disabledBackground' : '#0F6E56',
                                    color: isCurrent ? 'text.disabled' : '#fff',
                                    '&:hover': { bgcolor: '#0c5a46' },
                                }}
                            >
                                {isCurrent ? 'Current plan' : isPending && pendingPlanId === plan.id ? 'Redirecting…' : 'Upgrade'}
                            </Button>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

const Feature = ({ text }: { text: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CheckRounded sx={{ fontSize: 15, color: '#0F6E56' }} />
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{text}</Typography>
    </Box>
)
