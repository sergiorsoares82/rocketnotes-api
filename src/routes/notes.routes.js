const { Router } = require('express');
const NotesController = require('../controllers/NotesController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const notesController = new NotesController();

const notesRoutes = Router();

notesRoutes.get('/', isAuthenticated, notesController.index);
notesRoutes.post('/', isAuthenticated, notesController.create);
notesRoutes.get('/:id', isAuthenticated, notesController.show);
notesRoutes.delete('/:id', isAuthenticated, notesController.delete);

module.exports = notesRoutes;
