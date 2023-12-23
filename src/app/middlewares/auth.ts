import { NextFunction, Response, Request } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'

interface CustomRequest extends Request {
  user: JwtPayload
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const token = req.headers.authorization

      // Check if the token is send from the client
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorozed')
      }

      // Check if the token is valid
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload

      const { role, userId, iat } = decoded

      // Checking if the user is exist
      const user = await User.isUserExistByCustomId(userId)
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
      }

      // checking if the user is already deleted
      if (await User.isUserDeleted(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted')
      }

      // checking if the user is blcoked
      const userStatus = user?.status
      if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked')
      }

      // comparision
      if (
        user.passwordChangeAt &&
        User.isJWTIssuedBefforePasswordChange(
          user.passwordChangeAt,
          iat as number,
        )
      ) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorozed')
      }

      // authorization
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorozed')
      }

      req.user = decoded as JwtPayload
      next()
    },
  )
}

export default auth
