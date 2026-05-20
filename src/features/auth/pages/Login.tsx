import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded, BoltRounded } from '@mui/icons-material';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import { useLogin } from '../hooks/useLogin';
import { useForm } from 'react-hook-form'
import { LoginFormSchema } from '../types/auth';
import type { LoginDataType } from '../types/auth';
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../stores/authStore';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

 

  const { register, handleSubmit, reset, formState: {
    errors
  } } = useForm<LoginDataType>({
    resolver: zodResolver(LoginFormSchema)

  });

  const { mutate: login, isPending, error, isError, isSuccess } = useLogin();

  const onSubmit =  (data: LoginDataType) => {
    login(data, {
      onSuccess: ()=> {
        toast.success('Logged in successfully.');
        reset()
      },
      onError: (error)=>{
        toast.error(error.message)
      }
    });
  };

    useEffect(()=>{
    if (isError && error) {
      toast.error(error.message)
    }

    if(isSuccess) toast.success('Logged in successfully.')

  }, [isError, error, isSuccess]);

  if (isAuthenticated) return <Navigate to='/dashboard' />



  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#F5F7FA',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2.5,
            bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BoltRounded sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }} >Frelio</Typography>
        </Box>

        <Card elevation={0}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Welcome back</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to manage your freelance projects
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('password')}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),


                  }

                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isPending}
                sx={{ mt: 1, py: 1.25 }}
              >
                {isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign:"center", mt:3, color:"text.secondary"}}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{fontWeight:600, color:"primary.main", underline:"hover"}}>
                Create account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
