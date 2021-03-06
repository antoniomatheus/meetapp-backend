import Router from 'express';
import multer from 'multer';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import UploadController from './app/controllers/UploadController';
import MeetupController from './app/controllers/MeetupController';
import MeetupRegistrationController from './app/controllers/MeetupRegistrationController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), UploadController.store);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/meetups/registration/:id', MeetupRegistrationController.store);
routes.delete('/meetups/registration/:id', MeetupRegistrationController.delete);

routes.get('/meetups/nextmeetups', MeetupRegistrationController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
