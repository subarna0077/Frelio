import {z} from 'zod'

export const ClientAddSchema = z.object({
  name: z.string().min(6, 'Enter full client name'),
  address: z.string().min(6, 'Enter client address'),
  phone: z.string().min(10, 'Phone number should be atleast 10 number long').max(15, 'Phone number should not be more than 15 characters').regex(/^\d+$/, 'Numbers only')
})

export type ClientFormType = z.infer<typeof ClientAddSchema>