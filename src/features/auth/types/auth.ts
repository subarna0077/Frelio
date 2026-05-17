import { z } from 'zod'


export const RegisterFormSchema = z.object({
    name: z.string().min(6, "Full name should be atleast 6 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should be atleast 8 characters"),
    confirmPassword: z.string(),
    businessName: z.string().optional(),
    panNumber: z.string().optional(),
    currency: z.enum(['NPR', 'USD']).optional()

}) // .refine expects the callback to return true if validation success, false if validation failed
//so we use data.password === data.confirmPassword -> if yes, then true, if no, then show error - it works that way
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords donot match',
        path: ['confirmPassword']
    })


export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, 'Password must be atleast 8 characters')
})

export type LoginDataType = z.infer<typeof LoginFormSchema>
export type RegisterDataType = z.infer<typeof RegisterFormSchema>

export interface User {
    email: string;
    name: string;
    id: string;
}
