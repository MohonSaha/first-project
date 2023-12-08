import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { acaemicSemesterNameCodeMapper } from './academicSemester.constant'
import { TAcademicSemester } from './academicSemester.interface'
import { AcademicSemester } from './academicSemester.model'

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
  // semester name --> semester code

  // acaemicSemesterNameCodeMapper['Fall']: ['01']  --> send by user.
  if (acaemicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code')
  }

  const result = await AcademicSemester.create(payLoad)
  return result
}

const getAllSemesterFromDB = async () => {
  const result = await AcademicSemester.find()
  return result
}

const getSingleSemesterFromDB = async (_id: string) => {
  const result = await AcademicSemester.findOne({ _id })
  return result
}

const updateAcademicSemesterIntoDB = async (
  id: string,
  payLoad: Partial<TAcademicSemester>,
) => {
  if (
    payLoad.name &&
    payLoad.code &&
    acaemicSemesterNameCodeMapper[payLoad.name] !== payLoad.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid semester Code')
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payLoad, {
    new: true,
  })
  return result
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateAcademicSemesterIntoDB,
}
