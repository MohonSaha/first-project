/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorhandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'
const app: Application = express()
import cookieParser from 'cookie-parser'

// Parsers
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))

// application routes
app.use('/api/v1', router)

const test = async (req: Request, res: Response) => {
  const a = 10
  res.send(a)
}

app.get('/', test)

// code for global error handler
app.use(globalErrorHandler)

// not found
app.use(notFound)

export default app
