import express from 'express'
import { StudentControllers } from './student.controller'
import validateRequest from '../../middlewares/validateRequest'
import { studentValidations } from './student.zod.recommend.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.get('/', StudentControllers.getAllStudents)

router.get(
  '/:id',
  auth(USER_ROLE.student, USER_ROLE.faculty, USER_ROLE.admin),
  StudentControllers.getSingleStudent,
)

router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
)

router.delete('/:id', StudentControllers.deleteStudent)

export const StudentRoutes = router
