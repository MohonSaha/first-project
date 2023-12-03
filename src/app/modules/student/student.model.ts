import { Schema, model } from 'mongoose'
import {
  TGaurdian,
  TLocalGaurdian,
  TStudent,
  TUserName,
  StudentModel,
} from './student.interface'
import validator from 'validator'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'First Name can not be more than 20 charecture'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
        return firstNameStr === value
      },
      message: '{VALUE} is not in Capitalize formet',
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
})

const gaurdianSchema = new Schema<TGaurdian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is required'],
    trim: true,
  },
  faterOccupation: {
    type: String,
    required: [true, 'Father Occupation Name is required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact is required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation Name is required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Name is required'],
    trim: true,
  },
})

const localGaurdianSchema = new Schema<TLocalGaurdian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required'],
  },
  contractNo: {
    type: String,
    required: [true, 'Local Guardian Contact is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required'],
  },
})

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user ID is required'],
      unique: true,
      ref: 'User', // referencing user model
    },
    name: {
      type: userNameSchema,
      required: [true, 'Student Name is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
    contactNo: { type: String, required: [true, 'Contact Number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood Group is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    parmanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required'],
    },
    gaurdian: {
      type: gaurdianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGaurdian: {
      type: localGaurdianSchema,
      required: [true, 'Local Guardian information is required'],
    },
    profileImage: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

// Query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

// virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} + ${this.name.middleName} + ${this.name.lastName}`
})

// Creating a custom static method
studentSchema.statics.isUserExist = async function (id: string) {
  const exisingUser = await Student.findOne({ id })
  return exisingUser
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
