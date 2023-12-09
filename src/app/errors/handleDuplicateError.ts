import { TErrorSouces, TGenericErrorResponse } from '../interface/error'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/)

  // Check if a match is found
  const extractedMessage = match && match[1]

  const errorSouces: TErrorSouces = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: 'Duplicate value',
    errorSouces,
  }
}

export default handleDuplicateError
