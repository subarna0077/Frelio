import { useFormContext } from 'react-hook-form'
import { Box, TextField } from '@mui/material'
import type { ClientFormType } from '../../types/types'
import { SectionLabel } from '../AddClientModal'


const fieldProps = {
    size: 'small' as const,
    fullWidth: true,
    slotProps: {
        inputLabel: { sx: { fontSize: 13 } },
        input: { sx: { fontSize: 13 } },
    },
};

export function StepDetails() {
    const { register, formState: { errors } } = useFormContext<ClientFormType>();

    return (

        <Box>
            <SectionLabel>Basic info</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                    label="Full name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    autoFocus
                    {...fieldProps}
                />
                <TextField
                    label="Billing name"
                    {...register('billing_name')}
                    error={!!errors.billing_name}
                    helperText={errors.billing_name?.message}
                    {...fieldProps}

                />
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        label="Email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...fieldProps}
                    />
                    <TextField
                        label="Phone"
                        {...register('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        {...fieldProps}

                    />
                </Box>
                <TextField
                    label="PAN / VAT number"
                    {...register('pan_number')}
                    error={!!errors.pan_number}
                    helperText={errors.pan_number?.message}
                    {...fieldProps}

                />
                <TextField
                    label="Notes"
                    {...register('notes')}
                    multiline
                    rows={2}
                    slotProps={{
                        inputLabel: { sx: { fontSize: 13 } },
                        input: { sx: { fontSize: 13 } },
                        formHelperText: { sx: { fontSize: 11 } },
                    }}
                    helperText="Private — not shown on invoices"
                />
            </Box>
        </Box>

    )
}