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
                    full_name: data.name,
                    business_name: data.businessName ?? null,
                    pan_number: data.panNumber ?? null, // since our db has null default,  this current line is called nullish coeallision
                    currency: data.currency ?? null,        
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