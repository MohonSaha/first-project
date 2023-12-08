import { Schema, model } from 'mongoose'
import { TAcademicSemester } from './academicSemester.interface'
import {
  Months,
  AcademicSemesterCode,
  AcademicSemesterName,
} from './academicSemester.constant'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const acedemicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: AcademicSemesterName,
  },
  code: {
    type: String,
    required: true,
    enum: AcademicSemesterCode,
  },
  year: {
    type: String,
    required: true,
  },
  startMonth: {
    type: String,
    required: true,
    enum: Months,
  },
  endMonth: {
    type: String,
    required: true,
    enum: Months,
  },
})

acedemicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year, // this indicates the current document(client just sent) that comes for save in document. So we can acces the document through 'this'.
    name: this.name,
  })

  if (isSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester is already exist!!')
  }
  next()
})

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  acedemicSemesterSchema,
)
