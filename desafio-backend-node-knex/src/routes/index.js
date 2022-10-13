const { Router } = require('express');

const { usersRouter } = require('./users.routes');
const { movieNotesRouter } = require('./movieNotes.routes');
const { movieTagsRouter } = require('./movieTags.routes');

const routes = Router();

routes.use('/users', usersRouter)
routes.use('/movies', movieNotesRouter)
routes.use('/tags', movieTagsRouter)


module.exports = { routes }