import { z } from 'zod'

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string()
  })
  .refine((data) => data.password.length >= 8, {
    message: 'Passwords must be at least 8 characters long.',
    path: ['passTooShort']
  })

export type LoginUserType = z.infer<typeof loginSchema>
