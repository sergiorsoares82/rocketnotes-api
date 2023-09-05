const { Router } = require('express');
const UsersController = require('../controllers/UsersController');
const UserAvatarController = require('../controllers/UserAvatarController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const multer = require('multer');
const uploadConfig = require('../configs/uploads');

const userRoutes = Router();
const uplodad = multer(uploadConfig.MULTER);

const userController = new UsersController();
const userAvatarController = new UserAvatarController();

userRoutes.post('/', userController.create);
userRoutes.put('/', isAuthenticated, userController.update);
userRoutes.patch(
  '/avatar',
  isAuthenticated,
  uplodad.single('avatar'),
  userAvatarController.update
);

module.exports = userRoutes;
