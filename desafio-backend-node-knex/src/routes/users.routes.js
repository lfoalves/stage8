const { Router } = require('express');
const { UserController } = require('../controllers/UserController');

const usersRouter = Router()
const userController = new UserController();

usersRouter.post('/', userController.create);
usersRouter.get('/', userController.show);
usersRouter.put('/:user_id', userController.update);
usersRouter.delete('/:user_id', userController.delete);

module.exports = { usersRouter }