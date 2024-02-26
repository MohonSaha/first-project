import { RequestHandler } from 'express'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is created successfully',
      data: result,
    })
  },
)

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic departments are retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const departmentID = req.params.departmentID
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      departmentID,
    )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is retrieved successfully',
    data: result,
  })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const departmentID = req.params.departmentID
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentID,
      req.body,
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department are updated successfully',
    data: result,
  })
})

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
}
