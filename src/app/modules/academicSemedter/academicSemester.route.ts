import express from 'express'
import { AcademicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidations } from './academicSemester.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
// import { StudentControllers } from './student.controller'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
)

router.get(
  '/',
  auth(USER_ROLE.admin),
  AcademicSemesterControllers.getAllSemester,
)

router.get(
  '/:semesterID',
  auth(USER_ROLE.admin),
  AcademicSemesterControllers.getSingleSemester,
)

router.patch(
  '/:semesterID',
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
)

export const AcademicSemesterRoutes = router
