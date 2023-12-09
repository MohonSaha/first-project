import mongoose from 'mongoose'
import { TErrorSouces, TGenericErrorResponse } from '../interface/error'

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSouces: TErrorSouces = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        messsage: val?.message,
      }
    },
  )

  const statusCode = 400
  return {
    statusCode,
    message: 'ami validation error',
    errorSouces,
  }
}

export default handleValidationError
