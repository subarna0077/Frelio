import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  VisibilityRounded,
  VisibilityOffRounded,
  BoltRounded,
  CheckCircleOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterFormSchema } from '../types/auth'
import type { RegisterDataType } from '../types/auth'
import { useRegister } from '../hooks/useRegister'

// ── design tokens ─────────────────────────────────────────────────────────────

const C = {
  bg: '#FFFFFF',
  bgSubtle: '#F7F7F5',
  bgDark: '#0D2218',
  primary: '#0F6E56',
  primaryHover: '#0A5A45',
  text: '#111210',
  textSec: '#64635F',
  border: '#E5E5E2',
}

const DISPLAY = "'DM Serif Display', Georgia, serif"
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif"

// ── brand panel ───────────────────────────────────────────────────────────────

const brandFeatures = [
  'Free to start — no credit card needed',
  'Set up in under 5 minutes',
  'Invoice your first client right away',
  'Get paid through Khalti',
]

const BrandPanel = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'flex' },
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '42%',
      flexShrink: 0,
      bgcolor: C.bgDark,
      px: 6,
      py: 7,
    }}
  >
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 7 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: 1.5,
          bgcolor: C.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BoltRounded sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontFamily: SANS, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
          Frelio
        </Typography>
      </Box>

      <Typography sx={{
        fontFamily: DISPLAY,
        fontSize: { md: 28, lg: 34 },
        fontWeight: 400,
        color: '#fff',
        lineHeight: 1.18,
        letterSpacing: '-0.02em',
        mb: 2,
      }}>
        Stop managing clients in WhatsApp and Excel.
      </Typography>

      <Typography sx={{
        fontFamily: SANS,
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.75,
        mb: 6,
      }}>
        Join Nepali freelancers who use Frelio to send professional invoices and get paid on time.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {brandFeatures.map((f) => (
          <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleOutlined sx={{ fontSize: 16, color: '#34D399', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {f}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>

    <Typography sx={{ fontFamily: SANS, fontSize: 11.5, color: 'rgba(255,255,255,0.18)' }}>
      Built for Nepali freelancers · {new Date().getFullYear()}
    </Typography>
  </Box>
)

// ── page ──────────────────────────────────────────────────────────────────────

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterDataType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { currency: 'NPR' },
  })

  const { mutate: registerFn, isPending } = useRegister()

  const onSubmit = (data: RegisterDataType) => {
    registerFn(data, {
      onSuccess: () => {
        toast.success('Account created successfully.')
        reset()
      },
      onError: () => {
        toast.error('Failed to create account. Please try again.')
      },
    })
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: { xs: C.bg, md: C.bgSubtle },
    }}>
      {/* Brand panel — left half on desktop */}
      <BrandPanel />

      {/* Form side — full width on mobile, right half on desktop */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'center',
        px: { xs: 3, sm: 6, md: 8, lg: 10 },
        py: { xs: 6, md: 8 },
        bgcolor: C.bg,
        overflowY: 'auto',
      }}>
        <Box sx={{ width: '100%', maxWidth: 480 }}>

          {/* Mobile-only logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, mb: 6 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: 1.5,
              bgcolor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BoltRounded sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontFamily: SANS, fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px' }}>
              Frelio
            </Typography>
          </Box>

          {/* Eyebrow */}
          <Typography sx={{
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.primary,
            mb: 1,
          }}>
            Get started free
          </Typography>

          {/* Headline */}
          <Typography component="h1" sx={{
            fontFamily: DISPLAY,
            fontSize: { xs: 28, md: 34 },
            fontWeight: 400,
            color: C.text,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            mb: 1,
          }}>
            Create your account
          </Typography>

          <Typography sx={{ fontFamily: SANS, fontSize: 14, color: C.textSec, mb: 4 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{
              fontFamily: SANS, fontWeight: 600, color: C.primary,
              textDecoration: 'none', '&:hover': { textDecoration: 'underline' },
            }}>
              Sign in
            </Link>
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Full name */}
            <TextField
              label="Full name"
              fullWidth
              autoFocus
              autoComplete="name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={fieldSx}
            />

            {/* Email */}
            <TextField
              label="Email address"
              type="email"
              fullWidth
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={fieldSx}
            />

            {/* Password row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                autoComplete="new-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message ?? 'Min. 8 characters'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="Toggle password visibility"
                          sx={{ mr: 0.25 }}
                        >
                          {showPassword
                            ? <VisibilityOffRounded sx={{ fontSize: 20 }} />
                            : <VisibilityRounded sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
              <TextField
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                fullWidth
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirm(!showConfirm)}
                          edge="end"
                          aria-label="Toggle confirm password visibility"
                          sx={{ mr: 0.25 }}
                        >
                          {showConfirm
                            ? <VisibilityOffRounded sx={{ fontSize: 20 }} />
                            : <VisibilityRounded sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />
            </Box>

            {/* Optional divider */}
            <Divider sx={{ my: 0.5 }}>
              <Typography sx={{ fontFamily: SANS, fontSize: 11.5, color: C.textSec, px: 1 }}>
                Optional — you can fill these later in Settings
              </Typography>
            </Divider>

            {/* Business name + PAN row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                label="Business name"
                fullWidth
                placeholder="Your studio or agency"
                {...register('businessName')}
                sx={fieldSx}
              />
              <TextField
                label="PAN number"
                fullWidth
                placeholder="123456789"
                {...register('panNumber')}
                sx={fieldSx}
              />
            </Box>

            {/* Currency */}
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Default currency"
                  fullWidth
                  sx={fieldSx}
                >
                  <MenuItem value="NPR">NPR — Nepali Rupee</MenuItem>
                  <MenuItem value="USD">USD — US Dollar</MenuItem>
                </TextField>
              )}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isPending}
              endIcon={!isPending && <ArrowForwardRounded sx={{ fontSize: 17 }} />}
              sx={{
                fontFamily: SANS,
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                bgcolor: C.primary,
                textTransform: 'none',
                py: 1.5,
                borderRadius: 1.5,
                '&:hover': { bgcolor: C.primaryHover },
                '&.Mui-disabled': { bgcolor: C.primary, opacity: 0.6, color: '#fff' },
              }}
            >
              {isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create account'}
            </Button>
          </Box>

          <Typography sx={{
            fontFamily: SANS,
            fontSize: 12,
            color: C.textSec,
            textAlign: 'center',
            mt: 2.5,
            lineHeight: 1.6,
          }}>
            By creating an account you agree to Frelio's terms of use.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── shared field style ────────────────────────────────────────────────────────

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: SANS,
    fontSize: 14,
    borderRadius: 1.5,
    '& fieldset': { borderColor: '#E5E5E2' },
    '&:hover fieldset': { borderColor: '#B0B0AC' },
    '&.Mui-focused fieldset': { borderColor: '#0F6E56', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': {
    fontFamily: SANS,
    fontSize: 14,
    '&.Mui-focused': { color: '#0F6E56' },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: SANS,
    fontSize: 12,
    mt: 0.75,
  },
}