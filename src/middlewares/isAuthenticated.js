const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não informado!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret);
    req.user = { id: Number(user_id) };
  } catch (error) {
    console.error(error);
    throw new AppError('Token de autenticação inválido!', 401);
  }

  return next();
}

module.exports = isAuthenticated;
