import { NextFunction, RequestHandler, Response, Request } from 'express'

// Higher Order Function: Just recieve a async function and resolve it and send the error to global errorHandler
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}

export default catchAsync
