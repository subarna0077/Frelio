import { useFormContext } from 'react-hook-form'
import { Box, Typography } from '@mui/material'
import type { ClientFormType } from '../../types/types'
import { SectionLabel } from '../AddClientModal'
import { PersonOutlined, BusinessOutlined } from '@mui/icons-material'


const CLIENT_TYPES = [
    {
        value: 'individual' as const,
        label: 'Individual',
        sub: 'A freelancer or solo person',
        icon: <PersonOutlined sx={{ fontSize: 20 }} />,
    },
    {
        value: 'business' as const,
        label: 'Business',
        sub: 'A company or organization',
        icon: <BusinessOutlined sx={{ fontSize: 20 }} />,
    },
];





export function StepType() {
    const { watch, setValue, trigger, formState: {
        errors
    } } = useFormContext<ClientFormType>()

    const selectedType = watch('client_type')

    return (
        <Box>
            <SectionLabel>Client type</SectionLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {CLIENT_TYPES.map(type => {
                    const isSelected = selectedType === type.value;
                    return (
                        <Box
                            key={type.value}
                            onClick={() => {
                                setValue('client_type', type.value)
                                trigger('client_type')
                            }}
                            sx={{
                                flex: 1,
                                border: '1px solid',
                                borderColor: isSelected ? '#0F6E56' : 'divider',
                                borderRadius: 2,
                                p: 2,
                                cursor: 'pointer',
                                bgcolor: isSelected ? '#E1F5EE' : 'transparent',
                                transition: 'all 0.12s ease',
                                '&:hover': {
                                    bgcolor: isSelected ? '#E1F5EE' : 'action.hover',
                                    borderColor: isSelected ? '#0F6E56' : 'text.disabled',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 1.5,
                                    bgcolor: isSelected ? '#0F6E56' : 'action.hover',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isSelected ? '#fff' : 'text.disabled',
                                    mb: 1,
                                }}
                            >
                                {type.icon}
                            </Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: isSelected ? '#0F6E56' : 'text.primary' }}>
                                {type.label}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
                                {type.sub}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
            {errors.client_type && (
                <Typography sx={{
                    fontSize: 12, color: 'error.main', mt: 0.5
                }}>{errors.client_type.message}</Typography>
            )}
        </Box>

    )
}