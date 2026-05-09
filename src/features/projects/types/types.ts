import {z} from 'zod'

export const AddProjectSchema = z.object({
    title: z.string().min(8, 'Add a detailed title.'),
    status: z.string().min(6, 'Status should be atleast 6 characters long.')
})

export type ProjectDataType = z.infer<typeof AddProjectSchema>
