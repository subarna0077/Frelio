import { useFormContext, Controller } from 'react-hook-form'
import { Box, TextField, Typography } from '@mui/material'
import type { ClientFormType } from '../../types/types'

export function StepDetails() {
  const { control, watch, register, formState: { errors } } = useFormContext<ClientFormType>()
  const clientType = watch('client_type')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {clientType === 'individual' ? 'Personal details' : 'Business details'}
      </Typography>

      {/* name */}
      <TextField
        label="Name *"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        autoFocus
      />

      {/* billing name — business only */}
      {clientType === 'business' && (
        <TextField
          label="Billing name"
          {...register('billing_name')}
          error={!!errors.billing_name}
          helperText={errors.billing_name?.message ?? 'Name that appears on invoices, if different'}
          fullWidth
        />
      )}

      {/* email */}
      <TextField
        label="Email *"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />

      {/* phone */}
      <TextField
        label="Phone *"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
      />

      {/* pan */}
      <TextField
        label={clientType === 'individual' ? 'Personal PAN' : 'Company PAN'}
        {...register('pan_number')}
        error={!!errors.pan_number}
        helperText={errors.pan_number?.message}
        fullWidth
      />

      {/* old address field — keep until data is migrated */}
      <TextField
        label="Address (legacy)"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message ?? 'Will be replaced by structured address below'}
        fullWidth
        multiline
        rows={2}
      />

      {/* notes */}
      <TextField
        label="Notes"
        {...register('notes')}
        fullWidth
        multiline
        rows={2}
        helperText="Private — not shown on invoices"
      />
    </Box>
  )
}