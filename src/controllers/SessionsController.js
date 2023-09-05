const knex = require('../database/knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../configs/auth');
const AppError = require('../utils/AppError');

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new AppError('Email e/ou senha incorretos.', 401);
    }

    const passworIsCorrect = await bcrypt.compare(password, user.password);

    if (!passworIsCorrect) {
      throw new AppError('Email e/ou senha incorretos.', 401);
    }

    const token = jwt.sign({}, config.jwt.secret, {
      subject: String(user.id),
      expiresIn: config.jwt.expiresIn,
    });
    return res.json({ user, token });
  }
}

module.exports = SessionsController;
