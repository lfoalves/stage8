const AppError = require('../utils/AppError');

const sqliteConnection = require('../database/sqlite/')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    console.log(name, email, password)
    
    const database = await sqliteConnection();
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    
    console.log(checkUserExists)

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }
    
    return response.status(201).json({})

  } 

  index() {}

  show() {}

  update() {}
  
  delete() {}
}

module.exports = UsersController;