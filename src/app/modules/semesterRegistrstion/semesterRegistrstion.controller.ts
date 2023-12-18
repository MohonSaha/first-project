import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { SemesterRegistrationServices } from './semesterRegistrstion.service'

const createSemesterRegstration: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
        req.body,
      )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration created successfully',
      data: result,
    })
  },
)

const getAllSemesterRegstration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
      req.query,
    )
  // send response here
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registrations are retrieved successfully',
    data: result,
  })
})

const getSingleSemesterRegstration = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration is retrieved successfully',
    data: result,
  })
})

const updateSemesterRegstration = catchAsync(async (req, res) => {
  const { id } = req.params
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department are updated successfully',
    data: result,
  })
})

export const SemesterRegstrationControllers = {
  createSemesterRegstration,
  getAllSemesterRegstration,
  getSingleSemesterRegstration,
  updateSemesterRegstration,
}
