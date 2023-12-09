import { ZodError, ZodIssue } from 'zod'
import { TErrorSouces, TGenericErrorResponse } from '../interface/error'

const handelZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSouces: TErrorSouces = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  const statusCode = 400
  return {
    statusCode,
    message: 'ami zod error',
    errorSouces,
  }
}

export default handelZodError
