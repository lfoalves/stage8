const { Router } = require('express');

const { MoviesController } = require('../controllers/MoviesController');

const moviesNotesRoutes = Router();
const moviesController = new MoviesController();

moviesNotesRoutes.post('/:user_id', moviesController.create);
moviesNotesRoutes.get('/', moviesController.show);
moviesNotesRoutes.delete('/:movie_id', moviesController.delete)

module.exports = { moviesNotesRoutes }
