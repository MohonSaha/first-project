import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseValidations } from './course.validation'
import { CoursesControllers } from './course.controller'

const router = express.Router()

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CoursesControllers.createCourse,
)

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CoursesControllers.updateCourse,
)

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CoursesControllers.assignFacultiesWithCourse,
)

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CoursesControllers.removeFacultiesWithCourse,
)

export const CourseRoutes = router
