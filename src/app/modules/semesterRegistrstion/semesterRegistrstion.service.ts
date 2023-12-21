import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { AcademicSemester } from '../academicSemedter/academicSemester.model'
import { TSemesterRegistration } from './semesterRegistrstion.interface'
import { SemesterRegistration } from './semesterRegistrstion.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { RegistrstionStatus } from './semesterRegistration.constant'

const createSemesterRegistrationIntoDB = async (
  payLoad: TSemesterRegistration,
) => {
  const academicSemester = payLoad?.academicSemester

  //   check if there any registered semester that is already "IPCOMING" or "ONGOING"
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrstionStatus.UPCOMING },
        { status: RegistrstionStatus.ONGOING },
      ],
    })

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !!`,
    )
  }

  // Check the semester registration is exist or not
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester)
  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This academic semester not found')
  }

  // Check if the semester is already registraed
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester: academicSemester,
  })

  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This academic semester is already registered',
    )
  }

  const result = await SemesterRegistration.create(payLoad)
  return result
}

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await semesterRegistrationQuery.modelQuery
  return result
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id)
  return result
}

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // if the requested registered semester is exists
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id)
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester Registration is not found',
    )
  }

  // if the requested senester registration is ended we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExist?.status
  const requestedStatus = payload?.status

  if (currentSemesterStatus === RegistrstionStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    )
  }

  //UPCOMING ---> ONGOING ----> ENDED
  if (
    currentSemesterStatus === RegistrstionStatus.UPCOMING &&
    requestedStatus === RegistrstionStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not direactly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  if (
    currentSemesterStatus === RegistrstionStatus.ONGOING &&
    requestedStatus === RegistrstionStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not change status from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
}
