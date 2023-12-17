import express from 'express'
import { userControllers } from './user.controller'
import { studentValidations } from '../student/student.zod.recommend.validation'
import validateRequest from '../../middlewares/validateRequest'
import { createFacultyValidationSchema } from '../faculty/faculty.validation'

const router = express.Router()

// Route will call controller function
router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
)

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  userControllers.createAcademicFaculty,
)

export const UserRoutes = router
