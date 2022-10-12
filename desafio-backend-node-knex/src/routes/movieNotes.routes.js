const { Router } = require('express')
const { MovieNotesController } = require('../controllers/MovieNotesController')

const movieNotesRouter = Router();
const movieNotesController = new MovieNotesController();

movieNotesRouter.get('/:note_id', movieNotesController.show)
movieNotesRouter.get('/', movieNotesController.index)
movieNotesRouter.post('/:user_id', movieNotesController.create)

module.exports = { movieNotesRouter }