import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { courseSearchableFields } from './course.constant'
import { TCourse, TCourseFaculty } from './course.interface'
import { Course, CourseFaculty } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload)
  return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCouses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await courseQuery.modelQuery
  const meta = await courseQuery.countTotal()
  return {
    meta,
    result,
  }
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate('preRequisiteCouses.course')
  return result
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCouses, ...courseReaminingData } = payload

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    // Step-1: Basic course info update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseReaminingData,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
    }

    // If there is any prerequisit course to update
    if (preRequisiteCouses && preRequisiteCouses.length > 0) {
      // filter out the deleted fields
      const deletedpreRequisites = preRequisiteCouses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course)

      const deletedPreRequisiteCouses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCouses: { course: { $in: deletedpreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )

      if (!deletedPreRequisiteCouses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCouses?.filter(
        (el) => el.course && !el.isDeleted,
      )

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCouses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }
    }

    await session.commitTransaction()
    await session.endSession()

    const result = await Course.findById(id).populate(
      'preRequisiteCouses.course',
    )

    return result
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!')
  }
}

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  )
  return result
}

const getFacultiesWithCourseIntoDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    'faculties',
  )
  return result
}

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  )
  return result
}

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  getFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
}
