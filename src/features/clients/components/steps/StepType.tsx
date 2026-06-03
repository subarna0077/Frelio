import { useFormContext, Controller } from 'react-hook-form'
import { Box, Card, CardActionArea, Typography } from '@mui/material'
import { PersonRounded, BusinessRounded } from '@mui/icons-material'
import type { ClientFormType } from '../../types/types'

const CLIENT_TYPES = [
  {
    value: 'individual',
    label: 'Individual',
    sub: 'A freelancer or solo person',
    icon: <PersonRounded sx={{ fontSize: 32 }} />
  },
  {
    value: 'business',
    label: 'Business',
    sub: 'A company or organization',
    icon: <BusinessRounded sx={{ fontSize: 32 }} />
  },
] as const

export function StepType() {
  const { control, formState: { errors } } = useFormContext<ClientFormType>()

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Select the type of client you are adding.
      </Typography>

      <Controller
        name="client_type"
        control={control}
        render={({ field }) => (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {CLIENT_TYPES.map(type => {
              const selected = field.value === type.value
              return (
                <Card
                  key={type.value}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderColor: selected ? 'primary.main' : 'divider',
                    borderWidth: selected ? 2 : 1,
                    transition: 'all .15s',
                  }}
                >
                  <CardActionArea
                    onClick={() => field.onChange(type.value)}
                    sx={{ p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}
                  >
                    <Box sx={{ color: selected ? 'primary.main' : 'text.secondary' }}>
                      {type.icon}
                    </Box>
                    <Box>
                      <Typography fontWeight={500}>{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.sub}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              )
            })}
          </Box>
        )}
      />

      {/* show error if user clicks Next without selecting */}
      {errors.client_type && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          Please select a client type
        </Typography>
      )}
    </Box>
  )
}