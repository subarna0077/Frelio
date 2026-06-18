import { useFormContext, Controller } from 'react-hook-form'
import {
    Box, Typography, FormControlLabel, Checkbox,
    TextField,
    MenuItem

} from '@mui/material'
import { SectionLabel } from '../AddClientModal'

import type { ClientFormType } from '../../types/types'
import { useGetProvince } from '../../hooks/useGetProvince'
import { useGetDistrictsByProvince } from '../../hooks/useGetDistrictsByProvince'


const fieldProps = {
    size: 'small' as const,
    fullWidth: true,
    slotProps: {
        inputLabel: { sx: { fontSize: 13 } },
        input: { sx: { fontSize: 13 } },
    },
};

export function StepAddress() {

    const { watch, control, register, formState: {
        errors
    } } = useFormContext<ClientFormType>()

    const officeProvinceId = watch('office_address.province_id');
    const billingProvinceId = watch('billing_address.province_id')
    const selectedType = watch('client_type')
    const billingIsDifferent = watch('billing_is_different')


    const { data: provinces } = useGetProvince();
    const { data: districtsByOffice } = useGetDistrictsByProvince(officeProvinceId)
    const { data: districtsByBilling } = useGetDistrictsByProvince(billingProvinceId ?? 0)


    return (
        <>
            <Box>
                <SectionLabel>Office address</SectionLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TextField
                        label="Address line 1"
                        {...register('office_address.address_line_1')}
                        error={!!errors.office_address?.address_line_1}
                        helperText={errors.office_address?.address_line_1?.message}
                        {...fieldProps}

                    />
                    <TextField
                        label="Address line 2"
                        {...register('office_address.address_line_2')}
                        error={!!errors.office_address?.address_line_2}
                        helperText={errors.office_address?.address_line_2?.message}
                        {...fieldProps}
                    />
                    <TextField
                        label="City"
                        {...register('office_address.city')}
                        error={!!errors.office_address?.city}
                        helperText={errors.office_address?.city?.message}
                        {...fieldProps}
                    />
                    <Box sx={{ display: 'flex', gap: 1.5 }}>

                        <Controller
                            name="office_address.province_id"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Provinces"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    error={!!errors.office_address?.province_id}
                                    helperText={errors.office_address?.province_id?.message}
                                    sx={{ flex: 1 }}
                                >
                                    {provinces?.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="office_address.district_id"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Districts"
                                    {...field} // field attaches ref, onblur, onchange, value, and name attribute to the input
                                    onChange={(e) => field.onChange(Number(e.target.value))}

                                    error={!!errors.office_address?.district_id}
                                    helperText={errors.office_address?.district_id?.message}
                                    sx={{ flex: 1 }}
                                >
                                    {districtsByOffice?.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                    </Box>
                </Box>
            </Box>

            {/* ── Billing address (business only) ── */}
            {selectedType === 'business' && (
                <Box>
                    <Box sx={{ borderTop: '0.5px solid', borderColor: 'divider', pt: 2.5 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    {...register('billing_is_different')}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                                    Billing address differs from office address
                                </Typography>
                            }
                        />
                    </Box>

                    {billingIsDifferent && (
                        <Box sx={{ mt: 2 }}>
                            <SectionLabel>Billing address</SectionLabel>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <TextField
                                    label="Address line 1"
                                    {...register('billing_address.address_line_1')}
                                    {...fieldProps}
                                    error={!!errors.billing_address?.address_line_1}
                                    helperText={errors.billing_address?.address_line_1?.message}
                                />
                                <TextField
                                    label="Address line 2"
                                    {...register('billing_address.address_line_2')}
                                    {...fieldProps}
                                    error={!!errors.billing_address?.address_line_2}
                                    helperText={errors.billing_address?.address_line_2?.message}
                                />
                                <TextField
                                    label="City"
                                    {...register('billing_address.city')}
                                    {...fieldProps}
                                    error={!!errors.billing_address?.city}
                                    helperText={errors.billing_address?.city?.message}



                                />
                                <Box sx={{ display: 'flex', gap: 1.5 }}>


                                    <Controller
                                        name='billing_address.province_id'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                select
                                                label="Select province"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                sx={{ flex: 1 }}
                                                error={!!errors.billing_address?.province_id}
                                                helperText={errors.billing_address?.province_id?.message}
                                            >
                                                {provinces?.map(p =>
                                                    <MenuItem key={p.id} value={p.id}>
                                                        {p.name}
                                                    </MenuItem>
                                                )}
                                            </TextField>

                                        )}
                                    />


                                    <Controller
                                        name='billing_address.district_id'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                select
                                                label="Select districts"
                                                sx={{ flex: 1 }}
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                error={!!errors.billing_address?.district_id}
                                                helperText={errors.billing_address?.district_id?.message}
                                            >
                                                {districtsByBilling?.map(d =>
                                                    <MenuItem
                                                        value={d.id}
                                                        key={d.id}
                                                    >{d.name}</MenuItem>)}

                                            </TextField>
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

        </>


    )
}