import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, value) => {
        if (err) return callback(err);

        return callback(
          null,
          value.toString('hex') + extname(file.originalname)
        );
      });
    },
  }),
};
