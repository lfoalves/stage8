const { Router } = require('express');

const { MoviesTagsController } = require('../controllers/MoviesTagsController');

const moviesTagsRoutes = Router();
const moviesTagsController = new MoviesTagsController();

moviesTagsRoutes.get('/:user_id', moviesTagsController.index)

module.exports = { moviesTagsRoutes }