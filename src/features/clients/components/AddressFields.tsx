import { useFormContext, Controller } from 'react-hook-form'
import { Box, TextField, Autocomplete, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import type { ClientFormType, Province, District } from '../../types/types'

interface Props {
  prefix: 'office_address' | 'billing_address'
  provinces: Province[]
  provincesLoading: boolean
}

export function AddressFields({ prefix, provinces, provincesLoading }: Props) {
  const { control, watch, setValue, register, formState: { errors } } = useFormContext<ClientFormType>()
  const [districts, setDistricts] = useState<District[]>([])
  const [districtsLoading, setDistrictsLoading] = useState(false)

  const provinceId = watch(`${prefix}.province_id`)
  const addressErrors = errors[prefix]

  useEffect(() => {
    if (!provinceId) {
      setDistricts([])
      return
    }

    setDistrictsLoading(true)
    fetch(`/api/districts?province_id=${provinceId}`)
      .then(r => r.json())
      .then(data => setDistricts(data))
      .finally(() => setDistrictsLoading(false))

    setValue(`${prefix}.district_id`, '')
  }, [provinceId, prefix, setValue])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Address line 1 *"
        {...register(`${prefix}.address_line_1`)}
        error={!!addressErrors?.address_line_1}
        helperText={addressErrors?.address_line_1?.message}
        fullWidth
      />

      <TextField
        label="Address line 2"
        {...register(`${prefix}.address_line_2`)}
        fullWidth
      />

      <TextField
        label="City *"
        {...register(`${prefix}.city`)}
        error={!!addressErrors?.city}
        helperText={addressErrors?.city?.message}
        fullWidth
      />

      <Controller
        name={`${prefix}.province_id`}
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            options={provinces}
            getOptionLabel={o => o.name}
            loading={provincesLoading}
            value={provinces.find(p => p.id === field.value) ?? null}
            onChange={(_, val) => field.onChange(val?.id ?? '')}
            renderInput={params => (
              <TextField
                {...params}
                label="Province *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {provincesLoading && <CircularProgress size={16} />}
                      {params.InputProps?.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name={`${prefix}.district_id`}
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            options={districts}
            getOptionLabel={o => o.name}
            loading={districtsLoading}
            disabled={!provinceId}
            value={districts.find(d => d.id === field.value) ?? null}
            onChange={(_, val) => field.onChange(val?.id ?? '')}
            renderInput={params => (
              <TextField
                {...params}
                label="District *"
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ??
                  (!provinceId ? 'Select a province first' : '')
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {districtsLoading && <CircularProgress size={16} />}
                      {params.InputProps?.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        )}
      />
    </Box>
  )
}