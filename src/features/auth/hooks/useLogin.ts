import { useMutation } from '@tanstack/react-query'
import type { LoginDataType } from '../types/auth'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../../../lib/supabase'
export const useLogin = () => {

    const setUser = useAuthStore(state => state.setUser)

    const loginFn = async (data: LoginDataType) => {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        })

        if (authError) throw new Error(authError.message);

        return authData;
    }

    return useMutation({
        mutationFn: loginFn,
        onSuccess: (data) => {
            const user = {
                email: data.user.email ?? '',
                id: data.user.id ?? '',
                name: data.user.user_metadata.full_name ?? ''
            }

            const accessToken = data.session.access_token
            setUser(user, accessToken)
        },
    })
}