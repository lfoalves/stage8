const { Router } = require('express');

const { MoviesNotesController } = require('../controllers/MoviesNotesController');

const moviesNotesRoutes = Router();
const moviesNotesController = new MoviesNotesController();

moviesNotesRoutes.post('/:user_id', moviesNotesController.create);
moviesNotesRoutes.get('/:user_id', moviesNotesController.index);
moviesNotesRoutes.get('/:user_id', moviesNotesController.show);
moviesNotesRoutes.delete('/:movie_id', moviesNotesController.delete)
moviesNotesRoutes.put('/:movie_id', moviesNotesController.update)

module.exports = { moviesNotesRoutes }
