import { useState } from 'react'
import {
    Box, Card, CardContent, Typography, TextField,
    Button, Divider, Stack, Alert, CircularProgress
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../../lib/supabase'
import { useAuthStore } from '../../auth/stores/authStore'
import { toast } from 'react-hot-toast'
import { useUpdateProfile } from '../../profiles/hooks/useUpdateProfile'

// ── Schemas ───────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
    full_name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    business_name: z.string().optional(),
    pan_number: z.string().optional(),
})

const PasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export type ProfileForm = z.infer<typeof ProfileSchema>
export type PasswordForm = z.infer<typeof PasswordSchema>


export const Settings = () => {
    const user = useAuthStore(state => state.user)
    const setUser = useAuthStore(state => state.setUser)
    const logout = useAuthStore(state => state.logout)

    const [passwordLoading, setPasswordLoading] = useState(false)

    const { mutate: updateProfile, isPending: profileLoading } = useUpdateProfile();

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors }
    } = useForm<ProfileForm>({
        resolver: zodResolver(ProfileSchema),
    })

    const onProfileSubmit = (data: ProfileForm) => {
        console.log(data);
        updateProfile(data, {
            onSuccess: () => {
                toast.success("User profile updated successfully.")
            },
            onError: (err) => {
                toast.error("Error occured while updating")
                console.log(err);
            }
        })

    }

    return (
        <Box sx={{ maxWidth: 640, mx: 'auto' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Settings
            </Typography>

            {/* ── Profile Section ─────────────────────────────────────────── */}
            <Card elevation={0} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F0F0F0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Profile
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This information appears on your invoices
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleProfileSubmit(onProfileSubmit)}
                        sx={{ p: 3 }}
                    >
                        <Stack spacing={2.5}>

                            {/* email is read only — can't change email easily */}
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth size="small" sx={{ mt: 0.75 }}
                                    value={user?.email ?? ''}
                                    disabled
                                    helperText="Email cannot be changed"
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Full Name
                                </Typography>
                                <TextField
                                    fullWidth size="small" sx={{ mt: 0.75 }}
                                    error={!!profileErrors.full_name}
                                    helperText={profileErrors.full_name?.message}
                                    {...registerProfile('full_name')}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Phone
                                </Typography>
                                <TextField
                                    fullWidth size="small" sx={{ mt: 0.75 }}
                                    error={!!profileErrors.phone}
                                    helperText={profileErrors.phone?.message}
                                    {...registerProfile('phone')}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Business Name
                                </Typography>
                                <TextField
                                    fullWidth size="small" sx={{ mt: 0.75 }}
                                    error={!!profileErrors.business_name}
                                    helperText={profileErrors.business_name?.message}
                                    {...registerProfile('business_name')}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    PAN Number
                                </Typography>
                                <TextField
                                    fullWidth size="small" sx={{ mt: 0.75 }}
                                    error={!!profileErrors.pan_number}
                                    helperText={profileErrors.pan_number?.message}
                                    {...registerProfile('pan_number')}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={profileLoading}
                                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                            >
                                {profileLoading
                                    ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                                    : 'Save Changes'
                                }
                            </Button>

                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* ── Password Section ─────────────────────────────────────────── */}
            <Card elevation={0} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #F0F0F0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Change Password
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        sx={{ p: 3 }}
                    >
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    New Password
                                </Typography>
                                <TextField
                                    fullWidth size="small" type="password" sx={{ mt: 0.75 }}
                                //   error={!!passwordErrors.password}
                                //   helperText={passwordErrors.password?.message}
                                //   {...registerPassword('password')}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                    Confirm Password
                                </Typography>
                                <TextField
                                    fullWidth size="small" type="password" sx={{ mt: 0.75 }}
                                //   error={!!passwordErrors.confirmPassword}
                                //   helperText={passwordErrors.confirmPassword?.message}
                                //   {...registerPassword('confirmPassword')}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={passwordLoading}
                                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                            >
                                {passwordLoading
                                    ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                                    : 'Change Password'
                                }
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* ── Danger Zone ──────────────────────────────────────────────── */}
            <Card elevation={0} sx={{ border: '1px solid #FEE2E2' }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #FEE2E2' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'error.main' }}>
                            Danger Zone
                        </Typography>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Sign out
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Sign out of your account on this device
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {

                                    logout()
                                }}
                            >
                                Sign Out
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}