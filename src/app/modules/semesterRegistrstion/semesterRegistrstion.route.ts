import express from 'express'
import { SemesterRegistrationValidation } from './semesterRegistrstion.validation'
import validateRequest from '../../middlewares/validateRequest'
import { SemesterRegstrationControllers } from './semesterRegistrstion.controller'

const router = express.Router()

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegstrationControllers.createSemesterRegstration,
)

router.get('/', SemesterRegstrationControllers.getAllSemesterRegstration)

router.get('/:id', SemesterRegstrationControllers.getSingleSemesterRegstration)

// Update
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegstrationControllers.updateSemesterRegstration,
)

export const SemesterRegstrationRoutes = router
