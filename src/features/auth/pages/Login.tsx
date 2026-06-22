import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import {
  VisibilityRounded,
  VisibilityOffRounded,
  BoltRounded,
  CheckCircleOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material'
import { Navigate, Link as RouterLink } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useLogin } from '../hooks/useLogin'
import { useForm } from 'react-hook-form'
import { LoginFormSchema } from '../types/auth'
import type { LoginDataType } from '../types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../stores/authStore'

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
  'Milestone-based invoicing',
  'Client portal with Khalti payments',
  'PDF invoices sent by email',
  'Revenue dashboard',
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
        Your freelance business, properly managed.
      </Typography>

      <Typography sx={{
        fontFamily: SANS,
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.75,
        mb: 6,
      }}>
        Clients, projects, milestones, invoices — one clean workspace built for Nepali freelancers.
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

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginDataType>({
    resolver: zodResolver(LoginFormSchema),
  })

  const { mutate: login, isPending } = useLogin()

  const onSubmit = (data: LoginDataType) => {
    login(data, {
      onSuccess: () => {
        toast.success('Logged in successfully.')
        reset()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (isAuthenticated) return <Navigate to="/dashboard" />

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: { xs: C.bg, md: C.bgSubtle },
    }}>
      {/* Brand panel — left half on desktop */}
      <BrandPanel />

      {/* Form side — fills full width on mobile, right half on desktop */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, sm: 6, md: 8, lg: 10 },
        py: { xs: 6, md: 0 },
        bgcolor: C.bg,
      }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>

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
            Welcome back
          </Typography>

          {/* Headline */}
          <Typography component="h1" sx={{
            fontFamily: DISPLAY,
            fontSize: { xs: 30, md: 34 },
            fontWeight: 400,
            color: C.text,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            mb: 1,
          }}>
            Sign in to Frelio
          </Typography>

          <Typography sx={{ fontFamily: SANS, fontSize: 14, color: C.textSec, mb: 4.5 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{
              fontFamily: SANS, fontWeight: 600, color: C.primary,
              textDecoration: 'none', '&:hover': { textDecoration: 'underline' },
            }}>
              Create one free
            </Link>
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={fieldSx}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
                mt: 0.5,
                '&:hover': { bgcolor: C.primaryHover },
                '&.Mui-disabled': { bgcolor: C.primary, opacity: 0.6, color: '#fff' },
              }}
            >
              {isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
            </Button>
          </Box>

          <Typography sx={{ fontFamily: SANS, fontSize: 13, color: C.textSec, textAlign: 'center', mt: 3 }}>
            Forgot your password?{' '}
            <Link href="#" sx={{
              fontFamily: SANS, fontWeight: 600, color: C.primary,
              textDecoration: 'none', '&:hover': { textDecoration: 'underline' },
            }}>
              Reset it
            </Link>
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
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: '#B0B0AC' },
    '&.Mui-focused fieldset': { borderColor: C.primary, borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': {
    fontFamily: SANS,
    fontSize: 14,
    '&.Mui-focused': { color: C.primary },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: SANS,
    fontSize: 12,
    mt: 0.75,
  },
}

// expose C for Register.tsx reuse
export { C, DISPLAY, SANS, fieldSx }