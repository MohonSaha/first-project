import { z } from 'zod'

const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
})

const gaurdianValidationSchema = z.object({
  fatherName: z.string().min(1),
  faterOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
})

const localGaurdianValidationSchema = z.object({
  name: z.string().min(1),
  occupation: z.string().min(1),
  contractNo: z.string().min(1),
  address: z.string().min(1),
})

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      parmanentAddress: z.string(),
      gaurdian: gaurdianValidationSchema,
      localGaurdian: localGaurdianValidationSchema,
      profileImage: z.string().optional(),
    }),
  }),
})

export const studentValidations = {
  createStudentValidationSchema,
}