import { RequestHandler } from 'express'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'

// Create studnet account
const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: payLoad } = req.body

  const result = await UserServices.createStudentIntoDB(password, payLoad)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  })
})

// Create faculty account
const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { password, faculty: payLoad } = req.body

  const result = await UserServices.createFacultyIntoDB(password, payLoad)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty is created successfully',
    data: result,
  })
})

// Create admin account
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body

  const result = await UserServices.createAdminIntoDB(password, adminData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  })
})

export const userControllers = {
  createStudent,
  createAcademicFaculty,
  createAdmin,
}
