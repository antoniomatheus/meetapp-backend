import Router from 'express';

const routes = new Router();

routes.get('/users', (req, res) => {
  return res.json({ message: 'Hello, it is working!' });
});

export default routes;
