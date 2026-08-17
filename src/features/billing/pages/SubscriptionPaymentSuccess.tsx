import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { toast } from 'react-hot-toast'
import { useVerifySubscriptionPayment } from '../hooks/useVerifySubscriptionPayment'

export const SubscriptionPaymentSuccess = () => {
    const navigate = useNavigate()
    const params = new URLSearchParams(window.location.search)
    const pidx = params.get('pidx')
    const paymentId = params.get('purchase_order_id')

    const { mutate: verify, isPending, isSuccess, isError } = useVerifySubscriptionPayment()

    useEffect(() => {
        if (!pidx || !paymentId) return
        verify({ pidx, paymentId }, {
            onSuccess: () => toast.success('Your plan has been upgraded'),
            onError: (err) => toast.error(err instanceof Error ? err.message : 'Could not verify payment'),
        })
    }, [pidx, paymentId, verify])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
            {isPending && <CircularProgress size={28} />}
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {isPending && 'Verifying your payment…'}
                {isSuccess && 'Payment verified — your plan is now active.'}
                {isError && 'We could not verify this payment. Contact support if you were charged.'}
            </Typography>
            {(isSuccess || isError) && (
                <Typography
                    onClick={() => navigate('/billing')}
                    sx={{ fontSize: 13, color: '#0F6E56', cursor: 'pointer', fontWeight: 600 }}
                >
                    Back to billing
                </Typography>
            )}
        </Box>
    )
}
