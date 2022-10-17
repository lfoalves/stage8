const { Router } = require('express');

const { MoviesNotesController } = require('../controllers/MoviesNotesController');

const moviesNotesRoutes = Router();
const moviesNotesController = new MoviesNotesController();

moviesNotesRoutes.get('/:user_id', moviesNotesController.show);
moviesNotesRoutes.get('/', moviesNotesController.index);
moviesNotesRoutes.post('/:user_id', moviesNotesController.create);
moviesNotesRoutes.delete('/:movie_id', moviesNotesController.delete)
moviesNotesRoutes.put('/:movie_id', moviesNotesController.update)

module.exports = { moviesNotesRoutes }
