require('express-async-errors');
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const migrationsRun = require('./database/sqlite/migrations');
const uploadConfig = require('./configs/uploads');

const routes = require('./routes');
const AppError = require('./utils/AppError');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files/', express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

migrationsRun();

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });
  }
  console.error(error);
  return res
    .status(500)
    .json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

// app.get('/', (req, res) => {
//   res.send('Hello');
// });

// app.get('/user/:id', (req, res) => {
//   res.send(`Dados do usuário ${req.params.id}`);
// });

// POST COM REPOSTA EM TEXTO
// app.post('/users', (req, res) => {
//   const { name, email, password } = req.body;
//   res.send(`Nome: ${name} - Email: ${email} - Senha: ${password}`);
// });

// app.get('/message/:id/:user', (req, res) => {
//   res.send(`Mensagem: ${req.params.id}. Para o usuário: ${req.params.user}.`);
// });

// app.get('/pages', (req, res) => {
//   const { page, limit } = req.query;
//   res.send(`Páginas do livro: ${page}. Limite: ${limit}.`);
// });
