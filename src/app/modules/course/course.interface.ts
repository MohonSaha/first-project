import { Types } from 'mongoose'

export type TPreRequisiteCouses = {
  course: Types.ObjectId
  isDeleted: boolean
}

export type TCourse = {
  title: string
  prefix: string
  code: number
  credits: number
  preRequisiteCouses: [TPreRequisiteCouses]
  isDeleted?: boolean
}

export type TCourseFaculty = {
  course: Types.ObjectId
  faculties: [Types.ObjectId]
}
