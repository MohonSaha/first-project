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

router.get('/', CoursesControllers.getAllCourses)

router.get('/:id', CoursesControllers.getSingleCourse)

router.delete('/:id', CoursesControllers.deleteCourse)

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CoursesControllers.updateCourse,
)

export const CourseRoutes = router
