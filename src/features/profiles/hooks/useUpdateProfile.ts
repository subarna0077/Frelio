import { supabase } from "../../../lib/supabase";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProfileForm } from "../../auth/pages/Settings";
import { useAuthStore } from "../../auth/stores/authStore";
import type { Profile } from "../types/types";


export const useUpdateProfile = () => {
    const qc = useQueryClient()
    const user = useAuthStore(state => state.user)
    const setUser = useAuthStore(state=> state.setUser)
    

    const updateProfile = async (updatedProfileData: ProfileForm) => {
        // console.log(user)
        //console.log("user at call time", currentUser?.id)

        // const { data: { session } } = await supabase.auth.getSession()
    
        // Why the session is null?
        //When user logs in with the supabase.auth.signInWithPassword({email, password})
        /*
        Gotrue server validates credentials.
        Returns session object to the supabase client.
        supabase client does two thing simultaneously.

        1. Stores the session in localstorage 
        2. Stores the session in MEMORY

        App is running, client has session in memory

        When page refresh happen
        Browser refetches
        Everything in the memory is wiped
        Javascript heap is cleared
        All vairalbes will be gone.
        Supabase client instance get destroyed.

        When createClient runs -> brand new instance - memory is empty
        Xustand rehydrate from localstorage - user is restored
        Supabase client - memory still empty

        Token is in localstorage
        But client memory has no session

        localstorage is a persistent storage - it survives the refresh
        client memory is volatile storage. wiped out on refresh


        */        
      


        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updatedProfileData })
            .select('*')
            .eq('id', user?.id).single()

            console.log(data, error)
        if (error) throw error

        const {error: userUpdateError} = await supabase.auth.updateUser({
            data: {
                full_name: updatedProfileData.full_name,
                business_name: updatedProfileData.business_name,
                pan_number: updatedProfileData.pan_number,
                phone: updatedProfileData.phone
            }
        })

        if (userUpdateError) throw error;
        return data
    }

    return useMutation<Profile, Error, ProfileForm>({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['profiles', 'users'] }),
            console.log("Data from the profile update", data)
            setUser({
                ...user!,
                name: data.full_name         
            })
        }
    })
}