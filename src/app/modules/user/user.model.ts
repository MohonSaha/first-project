import { Schema, model } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // for createAt and updatedAt
  },
)

// We will use it to hash our password
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this

  // Hashing password and save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  )
  next()
})

// pre save middleware/ hook to set empty string of the password field
userSchema.post('save', function (doc, next) {
  doc.password = '' // Empty the hashed password
  next()
})

// reuseable static method for ckecking user exist
userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id })
}

// reuseable static method for ckecking if the user is deleted
userSchema.statics.isUserDeleted = async function (id: string) {
  const status = await User.findOne({ id })
  return status?.isDeleted
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword)
}

export const User = model<TUser, UserModel>('User', userSchema)
