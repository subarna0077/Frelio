import { useEffect } from 'react'
import { useVerifyPayment } from '../../features/payments/hooks/verifyPayment'


export const PaymentSuccessPortal = () => {
    const params = new URLSearchParams(window.location.search)
    console.log(params)
    const pidx = params.get("pidx")
    const orderId = params.get("purchase_order_id")

    console.log(pidx, orderId);


    const { mutate: verifyPayment, isPending } = useVerifyPayment()

    useEffect(() => {
        if (!pidx || !orderId) return;
        verifyPayment({pidx, orderId})
    }, [pidx, orderId, verifyPayment])
    return (
        <div>
            {isPending ? 'Verifying payment...': 'Congratulations your payment is succeeded.'}

        </div>
    )
}

