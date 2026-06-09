import { useFormContext, Controller } from 'react-hook-form'
import { Box, Typography, FormControlLabel, Checkbox, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { AddressFields } from '../AddressFields'
import type { ClientFormType, Province } from '../../types/types'
import { useGetProvince } from '../../hooks/useGetProvince'

export function StepAddress() {
  const { watch, control } = useFormContext<ClientFormType>()
  const clientType = watch('client_type')
  const billingIsDifferent = watch('billing_is_different')

  const {data: PROVINCES, error} = useGetProvince();


  const [provinces, setProvinces] = useState<Province[]>([])
  const [provincesLoading, setProvincesLoading] = useState(false)

  // fetch provinces once
  useEffect(() => {
    setProvincesLoading(true)
    fetch('/api/provinces')
      .then(r => r.json())
      .then(setProvinces)
      .finally(() => setProvincesLoading(false))
  }, [])

  return (
  
  )
}