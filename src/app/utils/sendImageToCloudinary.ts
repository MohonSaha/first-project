import multer from 'multer'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import config from '../config'
import fs from 'fs'

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cludinary_api_key,
  api_secret: config.cludinary_secret_key,
})

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error)
        }
        resolve(result as UploadApiResponse)
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            reject(err)
          } else {
            console.log('file is deleted')
          }
        })
      },
    )
  })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/src/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

export const upload = multer({ storage: storage })
