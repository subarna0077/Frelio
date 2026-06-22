import {
    Box, Typography, TextField,
    Button, Stack, CircularProgress
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
    path: ['confirmPassword'],
})

export type ProfileForm = z.infer<typeof ProfileSchema>
export type PasswordForm = z.infer<typeof PasswordSchema>

// ── Shared field style — matches the rest of the app ─────────────────────

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        fontSize: 13,
        borderRadius: 1.5,
        '& fieldset': { borderColor: 'divider' },
        '&:hover fieldset': { borderColor: 'text.disabled' },
        '&.Mui-focused fieldset': { borderColor: 'text.primary', borderWidth: 1 },
        '&.Mui-disabled fieldset': { borderColor: 'divider' },
    },
    '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: 'inherit',
        color: 'text.disabled',
        fontSize: 13,
    },
    '& .MuiFormHelperText-root': { fontSize: 11, mt: 0.5 },
}

// ── Sub-components ────────────────────────────────────────────────────────

/** Section card — same border + header pattern as SectionCard in ClientDetail */
const SettingsCard = ({
    title,
    description,
    danger,
    children,
}: {
    title: string
    description?: string
    danger?: boolean
    children: React.ReactNode
}) => (
    <Box
        sx={{
            border: '1px solid',
            borderColor: danger ? '#FEE2E2' : 'divider',
            borderRadius: 2,
            overflow: 'hidden',
        }}
    >
        {/* card header */}
        <Box
            sx={{
                px: 2.5,
                py: 1.75,
                borderBottom: '0.5px solid',
                borderColor: danger ? '#FEE2E2' : 'divider',
            }}
        >
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: danger ? 'error.main' : 'text.primary' }}>
                {title}
            </Typography>
            {description && (
                <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
                    {description}
                </Typography>
            )}
        </Box>
        {children}
    </Box>
)

/** Labelled field wrapper — same UPPERCASE label style as the rest of the app */
const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Box>
        <Typography sx={{
            fontSize: 11,
            color: 'text.disabled',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            mb: 0.75,
        }}>
            {label}
        </Typography>
        {children}
    </Box>
)

// ── Main component ────────────────────────────────────────────────────────

export const Settings = () => {
    const user = useAuthStore(state => state.user)
    const logout = useAuthStore(state => state.logout)

    const { mutate: updateProfile, isPending: profileLoading } = useUpdateProfile()

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileForm>({ resolver: zodResolver(ProfileSchema) })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordForm>({ resolver: zodResolver(PasswordSchema) })

    const onProfileSubmit = (data: ProfileForm) => {
        updateProfile(data, {
            onSuccess: () => toast.success('Profile updated.'),
            onError: () => toast.error('Failed to update profile.'),
        })
    }

    const onPasswordSubmit = (data: PasswordForm) => {
        // wire up when ready
        console.log(data)
    }

    return (
        <Box sx={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 0.5 }}>
                Settings
            </Typography>

            {/* ── Profile ──────────────────────────────────────────────── */}
            <SettingsCard title="Profile" description="This information appears on your invoices">
                <Box
                    component="form"
                    onSubmit={handleProfileSubmit(onProfileSubmit)}
                    sx={{ p: 2.5 }}
                >
                    <Stack spacing={2}>

                        <FieldRow label="Email">
                            <TextField
                                fullWidth
                                size="small"
                                value={user?.email ?? ''}
                                disabled
                                helperText="Email cannot be changed"
                                sx={fieldSx}
                            />
                        </FieldRow>

                        {/* Name + Phone side-by-side on sm+ */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <FieldRow label="Full name">
                                <TextField
                                    fullWidth
                                    size="small"
                                    error={!!profileErrors.full_name}
                                    helperText={profileErrors.full_name?.message}
                                    {...registerProfile('full_name')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                            <FieldRow label="Phone">
                                <TextField
                                    fullWidth
                                    size="small"
                                    error={!!profileErrors.phone}
                                    helperText={profileErrors.phone?.message}
                                    {...registerProfile('phone')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                        </Box>

                        {/* Business name + PAN side-by-side on sm+ */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <FieldRow label="Business name">
                                <TextField
                                    fullWidth
                                    size="small"
                                    error={!!profileErrors.business_name}
                                    helperText={profileErrors.business_name?.message}
                                    {...registerProfile('business_name')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                            <FieldRow label="PAN number">
                                <TextField
                                    fullWidth
                                    size="small"
                                    error={!!profileErrors.pan_number}
                                    helperText={profileErrors.pan_number?.message}
                                    {...registerProfile('pan_number')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                        </Box>

                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                disabled={profileLoading}
                                sx={{ fontSize: 13, minWidth: 120 }}
                            >
                                {profileLoading
                                    ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                                    : 'Save changes'}
                            </Button>
                        </Box>

                    </Stack>
                </Box>
            </SettingsCard>

            {/* ── Change password ───────────────────────────────────────── */}
            <SettingsCard title="Change password">
                <Box
                    component="form"
                    onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                    sx={{ p: 2.5 }}
                >
                    <Stack spacing={2}>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <FieldRow label="New password">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="password"
                                    error={!!passwordErrors.password}
                                    helperText={passwordErrors.password?.message}
                                    {...registerPassword('password')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                            <FieldRow label="Confirm password">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="password"
                                    error={!!passwordErrors.confirmPassword}
                                    helperText={passwordErrors.confirmPassword?.message}
                                    {...registerPassword('confirmPassword')}
                                    sx={fieldSx}
                                />
                            </FieldRow>
                        </Box>

                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                sx={{ fontSize: 13, minWidth: 140 }}
                            >
                                Change password
                            </Button>
                        </Box>

                    </Stack>
                </Box>
            </SettingsCard>

            {/* ── Danger zone ───────────────────────────────────────────── */}
            <SettingsCard title="Danger zone" danger>
                <Box sx={{ px: 2.5, py: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}>
                        <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Sign out</Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
                                Sign out of your account on this device
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ fontSize: 13, borderColor: '#FCA5A5', flexShrink: 0 }}
                            onClick={logout}
                        >
                            Sign out
                        </Button>
                    </Box>
                </Box>
            </SettingsCard>

        </Box>
    )
}