import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { CourseServices } from './course.service'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  })
})

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query)
  // send response here
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are retrieved successfully',
    data: result,
  })
})

const getSingleCourse = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await CourseServices.getSingleCourseFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  })
})

const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await CourseServices.deleteCourseFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  })
})

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  console.log(req.body)
  const result = await CourseServices.updateCourseIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course is updated succesfully',
    data: result,
  })
})

export const CoursesControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
}
