import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicFacultyValidation } from './academicFacultyValidation'
import { AcademicFacultyControllers } from './academicFacultty.controller'

const router = express.Router()

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)

router.get('/:facultyID', AcademicFacultyControllers.getSingleAcademicFaculty)

router.patch(
  '/:facultyID',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
)

export const AcademicFacultyRoutes = router
