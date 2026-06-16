import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { ProjectDataType } from '../types/types'
import { useAuthStore } from '../../auth/stores/authStore'


const getProjectCode = (title: string, existingCodes: string[]) => {
    const prefix = title.split(" ").map(val => val.slice(0, 1).toUpperCase()).join('');

    let counter = 1;
    let code = `${prefix}-${String(counter).padStart(3, '0')}`;
 

    while (existingCodes.includes(code)) {
        counter++;
        code = `${prefix}-${String(counter).padStart(3, '0')}`;
    }
    return code;
}


const createProjectApi = async (data: ProjectDataType, client_id: string, userId: string) => {


    const { data: projectsList, error: projectFetchError } = await supabase.from('projects').select();

    const projectCodeArray = projectsList?.map(project => project.project_code) ?? []

    const code = getProjectCode(data.title, projectCodeArray)

    if(projectFetchError) throw projectFetchError;

    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            title: data.title,
            description: data.description,
            status: 'active',
            project_code: code ?? null,
            start_date: data.start_date ?? null,
            due_date: data.due_date ?? null,
            client_id,
            user_id: userId,
        })
        .select()
        .single()

    if (error) throw error
    return project
}

export const useCreateProject = () => {
    const user = useAuthStore(state => state.user)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ProjectDataType & { client_id: string }) => {
            // data: ProjectDataType & {client_id: string} this creates an intersection type in typescript. 
            // It tells the ts compiler that a var or object must possess all the 
            //properties of the existing type and the additional property.
            const { client_id, ...restData } = data;
            if (!user?.id) throw new Error('User not authenticated')
            return createProjectApi(restData, client_id, user.id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['clients'] })
            queryClient.invalidateQueries({ queryKey: ['client'] })
        },
    })
}