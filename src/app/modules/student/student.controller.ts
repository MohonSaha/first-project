import { RequestHandler } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'

// controller function to get data
const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB()
  // send response here
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  })
})

// controller func to get single data
const getSingleStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId
  const result = await StudentServices.getSingleStudentFromDB(studentId)
  res.status(200).json({
    success: true,
    message: 'Single data retrieved done',
    data: result,
  })
})

// controller func to delete/update single data
const deleteStudent = catchAsync(async (req, res) => {
  const studentId = req.params.studentId
  const result = await StudentServices.deleteStudentFromDB(studentId)
  res.status(200).json({
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  })
})

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
}
