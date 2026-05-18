import {z} from 'zod'
import type { Client } from '../../clients/types/types'

export const AddProjectSchema = z.object({
    title: z.string().min(8, 'Add a detailed title.'),
    status: z.string().min(6, 'Status should be atleast 6 characters long.')
})

export type ProjectDataType = z.infer<typeof AddProjectSchema>

export type ProjectStatus = 'active' | 'completed' | 'on-hold';


export type Project = {
    id: string
    user_id: string
    client_id: string
    title: string
    status: ProjectStatus
    created_at: string
    clients: Pick<Client, 'id' | 'name' | 'phone'> | null
}

