import { useFormContext, Controller } from 'react-hook-form'
import { Box, Typography, FormControlLabel, Checkbox, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { AddressFields } from '../AddressFields'
import type { ClientFormType, Province } from '../../types/types'

export function StepAddress() {
  const { watch, control } = useFormContext<ClientFormType>()
  const clientType = watch('client_type')
  const billingIsDifferent = watch('billing_is_different')

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="body2" color="text.secondary">
        Office address
      </Typography>

      <AddressFields
        prefix="office_address"
        provinces={provinces}
        provincesLoading={provincesLoading}
      />

      {/* billing toggle — business only */}
      {clientType === 'business' && (
        <>
          <Divider />

          <Controller
            name="billing_is_different"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Billing address is different from office address
                  </Typography>
                }
              />
            )}
          />

          {billingIsDifferent && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Billing address
              </Typography>
              <AddressFields
                prefix="billing_address"
                provinces={provinces}
                provincesLoading={provincesLoading}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}