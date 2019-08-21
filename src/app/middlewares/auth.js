import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async function(req, res, next) {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.json({ error: 'Missing authorization token' });
  }

  const token = bearer.split(' ')[1];

  try {
    const decodedToken = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decodedToken.id;

    return next();
  } catch (err) {
    return res.json({ error: 'Token invalid' });
  }
}
