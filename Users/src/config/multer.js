import multer from 'multer';
import { extname, resolve } from 'path'

const random = ( ) => Math.floor(Math.random() *10000 + 10000);

export default {
  fileFilter: (req, file, cb) =>{
    if(file.mimetype !== 'application/pdf'){
      return cb(new multer.MulterError('File needs to be pdf'));
    }
    return cb(null, true)
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'uploads',  'arquive'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${random()}${extname(file.originalname)}`)
    },
  }),
};