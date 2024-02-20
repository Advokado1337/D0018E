import { v4 as uuidv4 } from "uuid"
import multer from "multer"
import path from "path"

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/products")
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
    },
})
