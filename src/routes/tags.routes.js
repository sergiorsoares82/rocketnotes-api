const { Router } = require('express');
const TagsController = require('../controllers/TagsController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const tagsController = new TagsController();
const tagsRoutes = Router();

tagsRoutes.use('/', isAuthenticated, tagsController.index);

module.exports = tagsRoutes;
