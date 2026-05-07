
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import type { LoginDataType } from '../types/auth'
import { LoginFormSchema } from '../types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../hooks/useLogin'
export const Login = () => {

  const { reset, register, handleSubmit, formState: {
    errors
  } } = useForm<LoginDataType>({
    resolver: zodResolver(LoginFormSchema)
  })

  const {mutate: login} = useLogin()

  const navigate = useNavigate()

  const onSubmit = (data: LoginDataType) => {
    login(data)
    navigate('/dashboard')
    reset()
  }

  return (
    <Box component="form"
    onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" sx={{
          textAlign: 'center'
        }}>
          Login
        </Typography>

        <TextField
          {...register('email')}
          error= {!!errors.email}
          helperText={errors.email?.message}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
        />

        <TextField
          {...register('password')}
           error= {!!errors.password}
          helperText={errors.password?.message}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          type='submit'
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Don't have an account? <Link to='/register'>Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}

