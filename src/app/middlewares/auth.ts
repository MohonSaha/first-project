import { NextFunction, Response, Request } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'

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
      jwt.verify(
        token,
        config.jwt_access_secret as string,
        function (err, decoded) {
          // err
          if (err) {
            throw new AppError(
              httpStatus.UNAUTHORIZED,
              'You are not authorozed',
            )
          }

          const role = (decoded as JwtPayload).role
          if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError(
              httpStatus.UNAUTHORIZED,
              'You are not authorozed',
            )
          }

          req.user = decoded as JwtPayload
          next()
        },
      )
    },
  )
}

export default auth
