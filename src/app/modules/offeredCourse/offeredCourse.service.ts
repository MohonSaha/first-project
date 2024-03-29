import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { SemesterRegistration } from '../semesterRegistrstion/semesterRegistrstion.model'
import { TOfferedCourse } from './offeredCourse.interface'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { OfferedCourse } from './offeredCourse.model'
import { hasTimeConflict } from './offeredCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'
import { Student } from '../student/student.model'

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

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `this faculty is not available at that time ! Choose other shcedule (time or day)`,
    )
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester })
  return result
}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload

  // Checking if the course exist
  const isOfferedCourseExist = await OfferedCourse.findById(id)
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  // Checking for faculty
  const isFacultyExist = await Faculty.findById(faculty)
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const semesterRegistrstion = isOfferedCourseExist.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistrstion)

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offer course as it is ${semesterRegistrationStatus?.status}`,
    )
  }

  // Solve time conflict problem
  // get the schedules of the faculties
  const assignSchedules = await OfferedCourse.find({
    semesterRegistrstion,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `this faculty is not available at that time ! Choose other shcedule (time or day)`,
    )
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await offeredCourseQuery.modelQuery
  const meta = await offeredCourseQuery.countTotal()

  return {
    meta,
    result,
  }
}

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // pagination setup

  const page = Number(query?.page) || 1
  const limit = Number(query?.limit) || 10

  const skip = (page - 1) * limit

  const student = await Student.findOne({ id: userId })

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'user is not found')
  }

  // find current onging semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  )

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'there is no ongoing semester registration ',
    )
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicDepartment: student.academicDepartment,
        academicFaculty: student.academicFaculty,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCouses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCouses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            'course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ]

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ])

  const total = (await OfferedCourse.aggregate(aggregationQuery)).length
  const totalPage = Math.ceil(result.length / limit)

  return {
    meta: {
      page,
      limit,
      total: total,
      totalPage,
    },
    result,
  }
}

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id)

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found')
  }

  return offeredCourse
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
}
