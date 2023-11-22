// import { Schema, model, connect } from 'mongoose'

export type Gaurdian = {
  fatherName: string
  faterOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type UserName = {
  firstName: string
  middleName: string
  lastName: string
}

export type LocalGaurdian = {
  name: string
  occupation: string
  contractNo: string
  address: string
}

export type Student = {
  id: string
  name: UserName
  gender: 'male' | 'female'
  dateOfBirth: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  parmanentAddress: string
  gaurdian: Gaurdian
  localGaurdian: LocalGaurdian
  profileImage?: URL
  isActive: 'active' | 'blocked'
}
