import { useMutation } from '@tanstack/react-query'
import type { LoginDataType } from '../types/auth'
import { supabase } from '../../../lib/supabase'
export const useLogin = () => {

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
    })
}