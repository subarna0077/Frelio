import { useFormContext, Controller } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import type { ClientFormType } from '../../types/types'

export function StepDetails() {
  const { control, watch, register, formState: { errors } } = useFormContext<ClientFormType>()
  const clientType = watch('client_type')

  return (
  
  )
}