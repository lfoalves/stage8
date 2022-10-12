const { Router } = require('express');

const { MoviesNotesController } = require('../controllers/MoviesNotesController');

const moviesNotesShowRoutes = Router();
const moviesNotesController = new MoviesNotesController();

moviesNotesShowRoutes.get('/:user_id', moviesNotesController.show);

module.exports = { moviesNotesShowRoutes }
