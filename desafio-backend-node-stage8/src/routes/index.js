const { Router } = require('express');

const { usersRoutes } = require('./users.routes');
const { moviesNotesRoutes } = require('./movies-notes.routes');
const { moviesTagsRoutes  } = require('./movies-tags.routes');

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({
    message: 'Use /users or /movies'
  })
})

routes.use('/users', usersRoutes);
routes.use('/movies', moviesNotesRoutes);
routes.use('/tags', moviesTagsRoutes)

module.exports = { routes }