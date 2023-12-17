import { z } from 'zod'

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be a string',
    })
    .max(20, { message: 'password can not be more than 20 cahrecters' })
    .optional(), // give the password or system will add default one
  //   needsPasswordChange: z.boolean().optional().default(true),
  //   role: z.enum(['student', 'faculty', 'admin']),
  //   stats: z.enum(['in-progress', 'blocked']).default('in-progress'),
  //   isDeleted: z.boolean().optional().default(false),
})

export const UserVAlidation = {
  userValidationSchema,
}
