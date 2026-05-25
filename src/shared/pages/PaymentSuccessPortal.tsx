import React, {useEffect} from 'react'

const khaltiLiveSecretKey = import.meta.env.VITE_LIVE_SECRET_KEY


export const PaymentSuccessPortal = () => {
    const params = new URLSearchParams(window.location.search)
    const pidx = params.get("pidx")

    useEffect(()=> {

        const verifyPayment = async ()=> {
            const res = await fetch(`/epayment/lookup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Key ${khaltiLiveSecretKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pidx: pidx
                })
            })

            const data = await res.json();
            console.log(data)
            return data;
        }

        verifyPayment()

        

    }, [])
  return (
    <div>

        Congratulations your payment is succeeded.
      
    </div>
  )
}

