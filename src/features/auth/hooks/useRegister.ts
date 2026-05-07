import {useMutation} from '@tanstack/react-query'
import type{ RegisterDataType } from '../types/auth'

export const useRegister = ()=>{

    return useMutation({
        mutationFn: async(data: RegisterDataType)=>{

            const {confirmPassword, ...userData} = data;
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json();
            console.log(result)

            if(!response.ok) {
                throw new Error(result || 'Login failed')
            }
            return result;


        }
    })




   
}