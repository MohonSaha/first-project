// import { object } from 'zod'
import config from '../../config'
import { TStudent } from '../student/student.interface'
import { TUser } from './user.interface'
import { User } from './user.model'
import { Student } from '../student/student.model'
import { AcademicSemester } from '../academicSemedter/academicSemester.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'
import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'
import { TFaculty } from '../faculty/faculty.interface'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Faculty } from '../faculty/faculty.model'
import { Admin } from '../Admin/admin.model'
import { TAdmin } from '../Admin/admin.interface'
import { verifyToken } from '../auth/auth.utils'

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {}

  // if password is not given, use default password. if given use that
  userData.password = password || (config.default_password as string)

  // set student role
  userData.role = 'student'
  // set student email
  userData.email = payLoad.email

  // find academic semester info just for creating id(code)
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

// Faculty creation
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string)

  //set faculty role
  userData.role = 'faculty'
  // set faculty email
  userData.email = payload.email

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )

  // confirm that payload has carryed valid academicDepartment
  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateFacultyId()

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }) // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }

    await session.commitTransaction()
    await session.endSession()

    return newFaculty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

// admin creation
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string)

  //set admin role
  userData.role = 'admin'
  // set admin email
  userData.email = payload.email

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    //set  generated id
    userData.id = await generateAdminId()

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session })

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }
    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session })

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

// Get user data accouding to role
const getMe = async (userId: string, role: string) => {
  let result = null
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user')
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user')
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user')
  }
  return result
}

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
}
