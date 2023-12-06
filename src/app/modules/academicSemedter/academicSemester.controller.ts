import { RequestHandler } from 'express'
// import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicSemesterServices } from './academicSemester.service'

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  })
})

const getAllSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllSemesterFromDB()
  // send response here
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semesters are retrieved successfully',
    data: result,
  })
})

const getSingleSemester = catchAsync(async (req, res) => {
  const semesterId = req.params.semesterID
  const result =
    await AcademicSemesterServices.getSingleSemesterFromDB(semesterId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semesters are retrieved successfully',
    data: result,
  })
})

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllSemester,
  getSingleSemester,
}
