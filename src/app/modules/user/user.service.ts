// import { object } from 'zod'
import config from '../../config'
import { TStudent } from '../student/student.interface'
import { TUser } from './user.interface'
import { User } from './user.model'
import { Student } from '../student/student.model'
import { AcademicSemester } from '../academicSemedter/academicSemester.model'
import { generateStudentId } from './user.utils'
import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {}

  // if password is not given, use default password. if given use that
  userData.password = password || (config.default_password as string)

  // set student role
  userData.role = 'student'

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payLoad.admissionSemester,
  )

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    if (admissionSemester) {
      // set manually generated id
      userData.id = await generateStudentId(admissionSemester)
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }) // array

    // create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user')
    }

    // set id and _id as user
    payLoad.id = newUser[0].id // embedding id
    payLoad.user = newUser[0]._id // reference id

    // create a student (transaction-2)
    const newStudent = await Student.create([payLoad], { session })

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new student')
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
  }
}

export const UserServices = {
  createStudentIntoDB,
}
