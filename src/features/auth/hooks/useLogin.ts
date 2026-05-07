import {useMutation} from '@tanstack/react-query'
import type{ LoginDataType } from '../types/auth'
import { useAuthStore } from '../stores/authStore'


export const useLogin = ()=>{

    const setUser = useAuthStore(state=> state.setUser)

    return useMutation({
        mutationFn: async(data: LoginDataType)=>{
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();
            console.log(result)

            if(!response.ok) {
                throw new Error(result || 'Login failed')
            }
            return result;
        },
        onSuccess: (data)=> {
            setUser(data?.user, data?.accessToken) 
        }
        
    })




   
}