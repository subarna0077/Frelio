
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material'

import { Link } from 'react-router-dom'
import { type RegisterDataType, RegisterFormSchema } from '../types/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks/useRegister'

export const Register = () => {
    const { register, handleSubmit, formState: {
        errors
    } } = useForm<RegisterDataType>({
        resolver: zodResolver(RegisterFormSchema)
    })
    const {mutate: registerFn} = useRegister()

    const onSubmit = (data: RegisterDataType) => {
        registerFn(data)
    }

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh"

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
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                    Register
                </Typography>

                <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                />

                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    {...register('email')}
                     error={!!errors.email}
                    helperText={errors?.email?.message}
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors?.confirmPassword?.message}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type='submit'
                >
                    Register
                </Button>

                <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Already have an account? <Link to='/login'>Login</Link>
                </Typography>
            </Paper>
        </Box>
    )
}
