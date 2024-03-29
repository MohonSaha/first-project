import { Schema, model } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const academicDepaertmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'academicFaculty',
    },
  },
  {
    timestamps: true,
  },
)

// Validation for duplicate department name
academicDepaertmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  })
  if (isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Department is already exist')
  }
  next()
})

// validation for deleted department
academicDepaertmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery() // get the query that we use findOneAndUpdate to update data
  const isDepartmentExist = await AcademicDepartment.findOne(query)
  if (!isDepartmentExist) {
    throw new AppError(404, 'This Department is not exist in database')
  }
  next()
})

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepaertmentSchema,
)
