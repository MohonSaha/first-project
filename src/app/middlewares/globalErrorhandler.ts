/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError, ZodIssue } from 'zod'
import { TErrorSouces } from '../interface/error'
import config from '../config'
import handelZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import AppError from '../errors/AppError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // settign default values
  let statusCode = 500
  let message = 'Something went Wrong'
  let errorSouces: TErrorSouces = [
    {
      path: '',
      message: 'Something went Wrong',
    },
  ]

  // validation dynamic message
  if (err instanceof ZodError) {
    const simplifiedError = handelZodError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSouces = simplifiedError.errorSouces
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSouces = simplifiedError.errorSouces
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSouces = simplifiedError.errorSouces
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSouces = simplifiedError.errorSouces
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSouces = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err?.message
    errorSouces = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  // ultimate error return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSouces,
    err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler
