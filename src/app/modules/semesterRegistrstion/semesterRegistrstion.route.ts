import express from 'express'
import { SemesterRegistrationValidation } from './semesterRegistrstion.validation'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegstrationControllers } from './semesterRegistrstion.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegstrationControllers.createSemesterRegstration,
)

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegstrationControllers.getAllSemesterRegstration,
)

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegstrationControllers.getSingleSemesterRegstration,
)

// Update
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegstrationControllers.updateSemesterRegstration,
)

export const SemesterRegstrationRoutes = router
