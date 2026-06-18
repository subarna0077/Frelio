import {z} from 'zod'
import type { Project } from '../../projects/types/types'
import type { Invoice } from '../../invoice/types/types'


export type currency = 'NPR' | 'USD'

export type ClientType = 'individual' | 'business'

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'archived'


export type Province = {
  id: string
  name: string
}

export type District = {
  id: string;
  name: string;
  province_id: string;
  province?: Province
}

export type Address = {
  id: string
  address_line_1: string
  address_line_2: string | null
  city: string
  district_id: string
  country: string

  // when u include in relations
  district?: District
}

const addressSchema = z.object({
  address_line_1: z.string().min(1, "Address line 1 is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'Please enter your city'),
  province_id: z.number().min(1, "Province is required"), // for filtering districts in UI
  district_id: z.number().min(1, "District is required"),
})


// keep addressSchema as is — that's correct

export const ClientAddSchema = z.object({
  client_type: z.enum(['individual', 'business'], {
    // In zod enum, we cah set the errorMap to show the error.
    errorMap: ()=> ({message: 'Please select a client type.'})
  }),
  name: z.string().min(6, 'Enter full client name'),
  phone: z.string()
    .min(10, 'Phone number should be at least 10 digits')
    .max(15, 'Phone number should not be more than 15 characters')
    .regex(/^\d+$/, 'Numbers only'),
  email: z.string().email('Enter a valid email'),

  // new optional fields
  billing_name: z.string().optional(),
  pan_number: z.string().optional(),
  currency: z.enum(['NPR', 'USD']),
  notes: z.string().optional(),

  // address — replaces old flat address string
  office_address: addressSchema,
  billing_is_different: z.boolean(),
  billing_address: addressSchema.optional(),

}).refine((data) => {
  if (data.client_type === 'business' && data.billing_is_different) {
    return !!data.billing_address
  }
  return true
}, {
  message: 'Billing address is required',
  path: ['billing_address'],
})

export type ClientFormType = z.infer<typeof ClientAddSchema>



export type Client = {
  id: string
  user_id: string
  name: string
  phone:string
  address:string | null
  created_at: string
  email: string
  billing_name: string | null
  pan_number: string | null
  currency: currency
  status: ClientStatus
  notes: string | null
  address_id: string | null
  billing_address_id: string | null
  deleted_at: string | null
  updated_at: string
  client_type: ClientType
  projects: Pick<Project, 'id' | 'title' | 'status'| 'created_at' | 'start_date' | 'milestones'>[]

  office_address?: Address
  billing_address?: Address
  invoices?: Invoice[]
}