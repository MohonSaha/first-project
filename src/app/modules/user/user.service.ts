// import { object } from 'zod'
import config from '../../config'
import { TStudent } from '../student/student.interface'
import { TUser } from './user.interface'
import { User } from './user.model'
import { Student } from '../student/student.model'
import { TAcademicSemester } from '../academicSemedter/academicSemester.interface'
import { AcademicSemester } from '../academicSemedter/academicSemester.model'
import { generateStudentId } from './user.utils'

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

  if (admissionSemester) {
    // set manually generated id
    userData.id = await generateStudentId(admissionSemester)
  }

  // create a user
  const newUser = await User.create(userData)

  // create a student
  if (Object.keys(newUser).length) {
    // set id and _id as user
    payLoad.id = newUser.id // embedding id
    payLoad.user = newUser._id // reference id

    const newStudent = await Student.create(payLoad)

    return newStudent
  }
}

export const UserServices = {
  createStudentIntoDB,
}
