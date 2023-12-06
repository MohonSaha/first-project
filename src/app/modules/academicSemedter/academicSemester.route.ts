import express from 'express'
import { AcademicSemesterControllers } from './academicSemester.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AcademicSemesterValidations } from './academicSemester.validation'
// import { StudentControllers } from './student.controller'

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
)

router.get('/', AcademicSemesterControllers.getAllSemester)

router.get('/:semesterID', AcademicSemesterControllers.getSingleSemester)

// router.delete('/:studentId', StudentControllers.deleteStudent)

export const AcademicSemesterRoutes = router
