/* eslint-disable no-undefined */
import { TAcademicSemester } from '../academicSemedter/academicSemester.interface'
import { User } from './user.model'

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastStudent?.id ? lastStudent.id.substring(6) : undefined
}

// year, semestercode, 4 digit number
export const generateStudentId = async (payLoad: TAcademicSemester) => {
  // 4 Digit number ==================
  // for the first time
  const currentId = (await findLastStudentId()) || (0).toString()
  //   increment
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`

  return incrementId
}
