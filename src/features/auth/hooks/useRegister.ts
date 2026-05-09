import { useMutation } from '@tanstack/react-query'
import type { RegisterDataType } from '../types/auth'
import { supabase } from '../../../lib/supabase'
import {useNavigate} from 'react-router-dom'

export const useRegister = () => {
    const navigate = useNavigate()

    const registerFn = async (data: RegisterDataType) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.name
                }
            }
        });

        if (authError) throw authError;
        console.log(authData)

        return authData     
    }

    return useMutation({
        mutationFn: registerFn,
        onSuccess: ()=>{
            navigate('/dashboard')
        }
    })
}