import {
    Box, Card, CardContent, TextField, Button, Typography,
    Link, MenuItem, Divider,
} from '@mui/material';
import { BoltRounded } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import type { RegisterDataType } from '../types/auth';
import { useForm, Controller } from 'react-hook-form'
import { useRegister } from '../hooks/useRegister';
import {toast} from 'react-hot-toast'

export const Register = () => {

    const { register, control, handleSubmit, reset } = useForm<RegisterDataType>();

    const { mutate: registerFn} = useRegister()

    const onSubmit = (data: RegisterDataType) => {
        registerFn(data, {
            onSuccess: ()=>{
                toast.success("Registered successfully.")
                reset()
            },
            onError: ()=>{
                toast.error("Failed to register")
                reset()
            }

        })
    };

    return (
        <Box sx={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', bgcolor: '#F5F7FA', p: 2,
        }}>
            <Box sx={{ width: '100%', maxWidth: 460 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BoltRounded sx={{ color: '#fff', fontSize: 22 }} />
                    </Box>
                    <Typography variant="h5" sx={{fontWeight:800, letterSpacing: '-0.5px'}}>Frelio</Typography>
                </Box>

                <Card elevation={0}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{fontWeight:700, mb:0.5}}>Create your account</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb:3}}>
                            Start managing your freelance business for free
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField label="Full name *" fullWidth {...register('name')} />
                            <TextField label="Email address *" type="email" fullWidth {...register('email')} />
                            <TextField label="Password *" type="password" fullWidth {...register('password')} />
                            <TextField label="Confirm Password *" type="password" fullWidth {...register('confirmPassword')} />

                            <Divider sx={{ my: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Optional details</Typography>
                            </Divider>

                            <TextField label="Business name" fullWidth {...register('businessName')} />
                            <TextField label="PAN number" fullWidth {...register('panNumber')} />

                            <Controller
                                name='currency'
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label='Default currency' fullWidth>
                                        <MenuItem value="NPR"> NPR - Nepali rupee</MenuItem>
                                        <MenuItem value="USD">USD - US Dollar</MenuItem>
                                    </TextField>
                                )}
                            >

                            </Controller>


                            <Button
                                type="submit" variant="contained" size="large" fullWidth
                                sx={{ mt: 1, py: 1.25 }}
                            >
                                Create account
                                {/* {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create account'} */}
                            </Button>
                        </Box>

                        <Typography variant="body2" sx={{textAlign: 'center', mt:3, color: 'text.secondary'}}>
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" sx={{color:"primary.main", fontWeight: 600, underline:"hover"}}>
                                Sign in
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

