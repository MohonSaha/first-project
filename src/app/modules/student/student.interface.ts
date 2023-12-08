// import { Schema, model, connect } from 'mongoose'

import { Model, Types } from 'mongoose'

export type TGaurdian = {
  fatherName: string
  faterOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TLocalGaurdian = {
  name: string
  occupation: string
  contractNo: string
  address: string
}

export type TStudent = {
  id: string
  user: Types.ObjectId
  password: string
  name: TUserName
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  parmanentAddress: string
  gaurdian: TGaurdian
  localGaurdian: TLocalGaurdian
  profileImage?: string
  admissionSemester: Types.ObjectId
  isDeleted: boolean
  academicDepartment: Types.ObjectId
}

// Code for creating static
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(id: string): Promise<TStudent | null>
}

// Code for creating instance:

// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>
// }

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >
