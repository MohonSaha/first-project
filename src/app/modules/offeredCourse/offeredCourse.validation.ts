import { z } from 'zod'
import { Days } from './offeredCourse.constant'

// const timeStringSchema = z.string().refine(
//   (time) => {
//     const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // 00-09 10-19 20-23
//     return regex.test(time)
//   },
//   {
//     message: 'Invalid time format , expected "HH:MM" in 24 hours format',
//   },
// )

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          return regex.test(time)
        },
        {
          message: 'invalid time formet. expected "HH:MM" in 24 hours.',
        },
      ),
      endTime: z.string(),
    })
    .refine(
      (body) => {
        // start date: 10:30 => 1970-01-01T10:30
        // start date: 12:30 => 1970-01-01T12:30

        // comparism
        const start = new Date(`1970-01-01T${body.startTime}:00`)
        const end = new Date(`1970-01-01T${body.endTime}:00`)
        return end > start
      },
      {
        message: 'Start time should be before end time !!',
      },
    ),
})

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string(),
    maxCapacity: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: z.string(), // HH: MM   00-23: 00-59
    endTime: z.string(),
  }),
})

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
}
