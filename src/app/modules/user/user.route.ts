import express from 'express'
import { userControllers } from './user.controller'
import { studentValidations } from '../student/student.zod.recommend.validation'
import validateRequest from '../../middlewares/validateRequest'
import { createFacultyValidationSchema } from '../faculty/faculty.validation'
import { createAdminValidationSchema } from '../Admin/admin.validation'

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

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  userControllers.createAdmin,
)

export const UserRoutes = router
