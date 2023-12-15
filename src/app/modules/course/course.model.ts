import { Schema, model } from 'mongoose'
import { TCourse, TPreRequisiteCouses } from './course.interface'

const preRequisiteCousesSchema = new Schema<TPreRequisiteCouses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
)

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisiteCouses: [preRequisiteCousesSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

export const Course = model<TCourse>('course', courseSchema)
