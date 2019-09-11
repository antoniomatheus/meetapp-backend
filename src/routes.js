import Router from 'express';

import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import UploadController from './app/controllers/UploadController';
import MeetupController from './app/controllers/MeetupController';
import MeetupUserInteractionController from './app/controllers/MeetupUserInteractionController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), UploadController.store);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/meetups/registration/:id', MeetupUserInteractionController.store);
routes.delete(
  '/meetups/registration/:id',
  MeetupUserInteractionController.delete
);

routes.get('/meetups/nextmeetups', MeetupUserInteractionController.index);

routes.put('/users', UserController.update);

export default routes;
