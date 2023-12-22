import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'

const loginUser = async (payload: TLoginUser) => {
  // Checking if the user is exist
  const user = await User.isUserExistByCustomId(payload?.id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // checking if the user is already deleted
  if (await User.isUserDeleted(payload?.id)) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted')
  }

  //   // checking if the user is blcoked
  const userStatus = isUserExist?.status
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked')
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!!')
  }

  // Access granded: Send access token, refreh token
}

export const AuthServices = {
  loginUser,
}
