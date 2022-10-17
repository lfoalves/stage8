const { Router } = require('express');

const { UsersController } = require('../controllers/UsersController');
const { MoviesNotesController } = require('../controllers/MoviesNotesController');
const { MoviesTagsController } = require('../controllers/MoviesTagsController');

const adminRoutes = Router();

const usersController = new UsersController();
const moviesNotesController = new MoviesNotesController();
const moviesTagsController = new MoviesTagsController();

adminRoutes.get('/users', usersController.show);
adminRoutes.get('/movie_notes', moviesNotesController.showAll);
adminRoutes.get('/movie_tags', moviesTagsController.show);

module.exports = { adminRoutes }
