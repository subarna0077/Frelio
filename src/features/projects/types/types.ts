import { z } from 'zod'
import type { Client } from '../../clients/types/types'
import type { Milestone } from '../../milestone/types/types'

export const AddProjectSchema = z.object({
    title: z.string().min(8, 'Add a valid title for this project.'),
    description: z.string().min(8, { message: 'Add a detailed description of this project' }).max(500, { message: 'Description cannot exceed 500 characters' }),
    start_date: z.string().optional(),
    due_date: z.string().optional(),
    client_id: z.string().min(1, 'Please select client')
})

export type ProjectDataType = z.infer<typeof AddProjectSchema>

export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';

export type Project = {
    id: string
    user_id: string
    client_id: string
    title: string
    project_code: string | null
    start_date: string | null
    due_date: string | null
    completed_at: string | null
    status: ProjectStatus
    created_at: string
    description: string | null

    clients: Pick<Client, 'id' | 'name' | 'phone'> | null
    milestones?: Milestone[]
}