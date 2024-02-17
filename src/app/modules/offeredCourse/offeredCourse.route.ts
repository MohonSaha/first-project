import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { OfferedCourseControllers } from './offeredCourse.controller'
import { OfferedCourseValidations } from './offeredCourse.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

// router.get('/', OfferedCourseControllers.getAllOfferedCourses)

router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses,
)

// router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses)

router.post(
  '/create-offered-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
)

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
)

// router.delete('/:id', OfferedCourseControllers.deleteOfferedCourseFromDB)

export const offeredCourseRoutes = router
