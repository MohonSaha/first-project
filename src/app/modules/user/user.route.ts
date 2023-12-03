import express from 'express'
import { userControllers } from './user.controller'
import { studentValidations } from '../student/student.zod.recommend.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

// Route will call controller function
router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
)

export const UserRoutes = router
