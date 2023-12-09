/* eslint-disable no-console */
import app from './app'
import config from './app/config'
import mongoose from 'mongoose'

import { Server } from 'http'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

// listening for the UnhandledPromiseRejection for asychronous code
process.on('unhandledRejection', () => {
  console.log(`😒😒 UnhandledRejection is delected. Shutting down...`)
  // off the server gracefully
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// listening for the uncaughtException for synchronous code
process.on('uncaughtException', () => {
  console.log(`😒😒 UncaughtException is delected. Shutting down...`)
  process.exit(1)
})
