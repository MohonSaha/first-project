import { z } from 'zod'

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
})

const createGaurdianValidationSchema = z.object({
  fatherName: z.string().min(1),
  faterOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
})

const createLocalGaurdianValidationSchema = z.object({
  name: z.string().min(1),
  occupation: z.string().min(1),
  contractNo: z.string().min(1),
  address: z.string().min(1),
})

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      parmanentAddress: z.string(),
      gaurdian: createGaurdianValidationSchema,
      localGaurdian: createLocalGaurdianValidationSchema,
      admissionSemester: z.string(),
      // profileImage: z.string().optional(),
      academicDepartment: z.string(),
    }),
  }),
})

// update student validation schema
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional().optional(),
  lastName: z.string().min(1).optional(),
})

const updateGaurdianValidationSchema = z.object({
  fatherName: z.string().min(1).optional(),
  faterOccupation: z.string().min(1).optional(),
  fatherContactNo: z.string().min(1).optional(),
  motherName: z.string().min(1).optional(),
  motherOccupation: z.string().min(1).optional(),
  motherContactNo: z.string().min(1).optional(),
})

const updateLocalGaurdianValidationSchema = z.object({
  name: z.string().min(1).optional(),
  occupation: z.string().min(1).optional(),
  contractNo: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
})

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      parmanentAddress: z.string().optional(),
      gaurdian: updateGaurdianValidationSchema.optional(),
      localGaurdian: updateLocalGaurdianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImage: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
})

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
}
