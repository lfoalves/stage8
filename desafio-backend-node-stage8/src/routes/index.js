const { Router } = require('express');

const { usersRoutes } = require('./users.routes');
const { moviesNotesRoutes } = require('./movies-notes.routes');

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({
    message: 'Use /users or /movies'
  })
})

routes.use('/users', usersRoutes );
routes.use('/movies', moviesNotesRoutes )

module.exports = { routes }