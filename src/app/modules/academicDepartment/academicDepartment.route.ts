import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicDepartmentValidation } from './academicDepaertment.validation'
import { AcademicDepartmentControllers } from './academicDepartment.controller'
import { USER_ROLE } from '../user/user.constant'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
)

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)

router.get(
  '/:departmentID',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
)

router.patch(
  '/:departmentID',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
)

export const AcademicDepartmentRoutes = router
