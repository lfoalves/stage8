const { Router } = require('express');

const { usersRoutes } = require('./users.routes');
const { moviesNotesRoutes } = require('./movies-notes.routes');
const { moviesTagsRoutes } = require('./movies-tags.routes');
const { moviesNotesShowRoutes } = require('./movies-notes-show.routes');
const { myMiddleware } = require('../middlewares/isAdmin');

const routes = Router();

// routes.use(myMiddleware);

routes.get('/', (request, response) => {
  return response.json({
    message: 'Acess: http://localhost:9999/users or http://localhost:9999/movies'
  })
})

routes.use('/users', usersRoutes);
routes.use('/movies', moviesNotesRoutes);
routes.use('/tags', moviesTagsRoutes)
routes.use('/show', moviesNotesShowRoutes)

module.exports = { routes }