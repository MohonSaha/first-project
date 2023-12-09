import mongoose from 'mongoose'
import { TErrorSouces, TGenericErrorResponse } from '../interface/error'

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSouces: TErrorSouces = [
    {
      path: err?.path,
      message: err?.message,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Invalid Id',
    errorSouces,
  }
}

export default handleCastError
