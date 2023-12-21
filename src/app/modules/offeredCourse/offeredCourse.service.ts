import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { SemesterRegistration } from '../semesterRegistrstion/semesterRegistrstion.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { OfferedCourse } from './offeredCourse.model'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  //  Check if the semester registration id is exist
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found')
  }

  // Extract academic semester from semester registration
  const academicSemester = isSemesterRegistrationExist.academicSemester

  // Checking for academic faculty
  const isAcademicFacultyExist = await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }

  // Checking for academic department
  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Departmentnot not found')
  }

  // Checking for course
  const isCourseExist = await Course.findById(course)
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  // Checking for faculty
  const isFacultyExist = await Faculty.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  // check if the departments is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`,
    )
  }

  // Check if the same course same section in the same registered semester exist
  const isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    })
  if (isSameOfferedCourseExistWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist.`,
    )
  }

  // Solve time conflict problem
  // get the schedules of the faculties
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  assignSchedules.forEach((Schedule) => {
    const existingStartTime = new Date(`1970-01-01T${Schedule.startTime}`)
    const existingEndTime = new Date(`1970-01-01T${Schedule.endTime}`)

    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`)
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      throw new AppError(
        httpStatus.CONFLICT,
        `this faculty is not available at that time ! Choose other shcedule (time or day)`,
      )
    }
  })

  const result = await OfferedCourse.create({ ...payload, academicSemester })
  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
}
