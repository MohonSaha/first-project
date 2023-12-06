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

  return lastStudent?.id ? lastStudent.id : undefined
}

// year, semestercode, 4 digit number
export const generateStudentId = async (payLoad: TAcademicSemester) => {
  // 4 Digit number ==================
  // for the first time
  let currentId = (0).toString() // 0000

  const lastStudentId = await findLastStudentId()
  //2030 01 0001
  const lastStudnetSemesterCode = lastStudentId?.substring(4, 6) // 01
  const lastStudnetYear = lastStudentId?.substring(0, 4) // 2030
  const currentSemesterCode = payLoad.code
  const currentYear = payLoad.year

  if (
    lastStudentId &&
    lastStudnetSemesterCode === currentSemesterCode &&
    lastStudnetYear === currentYear
  ) {
    currentId = lastStudentId.substring(6) // 0001
  }

  //   increment
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `${payLoad.year}${payLoad.code}${incrementId}`

  return incrementId
}
