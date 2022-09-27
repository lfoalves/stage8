const { Router } = require('express');
const NotesController = require('../controllers/NotesCrontoller');

const notesRouter = Router();
const notesController = new NotesController();

notesRouter.get('/', notesController.index)
notesRouter.post('/:user_id', notesController.create);
notesRouter.get('/:note_id', notesController.show);
notesRouter.delete('/:note_id', notesController.delete);

module.exports = notesRouter;

