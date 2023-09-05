const bcrypt = require('bcryptjs');
const sqliteConnection = require('../database/sqlite');
const AppError = require('../utils/AppError');

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;
    const database = await sqliteConnection();

    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    );

    if (checkUserExists) {
      throw new AppError('Este email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return res
      .status(201)
      .json({ message: `Usuário {${name}} criado com sucesso.` });
  }

  async update(req, res) {
    const { name, email, passwordOld, passwordNew } = req.body;
    const id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id]);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
      throw new AppError('Este email já está em uso.');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (passwordNew && !passwordOld) {
      throw new AppError(
        'Você precisa informar a senha atual para redefinir a senha.'
      );
    }

    if (passwordNew && passwordOld) {
      const checkOldPassword = await bcrypt.compare(passwordOld, user.password);
      if (!checkOldPassword) {
        throw new AppError('A senha atual está incorreta');
      }
      user.password = await bcrypt.hash(passwordNew, 8);
    }

    await database.run(
      'UPDATE users SET name = (?), email =(?), password = (?), updated_at = DATETIME("now") WHERE id = (?)',
      [user.name, user.email, user.password, id]
    );

    return res.status(200).json({ user });
  }
}

module.exports = UsersController;
