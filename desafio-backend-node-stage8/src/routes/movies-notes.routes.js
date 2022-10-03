const { Router } = require('express');

const { MoviesController } = require('../controllers/MoviesController');

const moviesNotesRoutes = Router();
const moviesController = new MoviesController();

moviesNotesRoutes.post('/:user_id', moviesController.create);
moviesNotesRoutes.get('/', moviesController.show);
moviesNotesRoutes.delete('/:movie_id', moviesController.delete)
moviesNotesRoutes.put('/:movie_id', moviesController.update)

module.exports = { moviesNotesRoutes }
