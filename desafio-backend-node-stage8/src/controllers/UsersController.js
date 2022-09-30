const {sqliteConnection} = require('../database/sqlite')
const { randomUUID } = require('crypto');

class UsersController {
  async create(request, reponse) {
    const database = await sqliteConnection();
    let id = randomUUID();
    let isUserId = true;

    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new Error('Dados do usuário são necessário para criação')
    }

    let usersExists = await database.all('SELECT * FROM users');
    console.log('USERS EXISTS', usersExists)

    while (isUserId) {
      id = randomUUID();
      isUserId = usersExists.some(userExists => userExists.id === id);
    }

    let isUserEmail = usersExists.some(userEmailExists => userEmailExists.email === email);
    
    console.log(isUserId, isUserEmail)

    if (isUserEmail) {
      throw new Error('Email já em uso');
    }
    
    if (!isUserId && !isUserEmail) {
      const result = await database.run(`
        INSERT INTO users (
          id, name, email, password
          ) VALUES (
            ?, ?, ?, ?
          )`, [id, name, email, password]
        );

      database.close();        
  
      return reponse.json({
        message: "Usuário criado com sucesso",
        data: result
      })
    }


  }

  async show(request, reponse) {
    const database = await sqliteConnection();

    const users = await database.all(`
      SELECT id, name, email, created_at
      FROM users ORDER BY created_at`
    );

    console.log(users)

    return reponse.json({
      message: 'SHOW USER CONTROLLER',
      data: users
    })
  }

  async update(request, reponse) {
    const database = await sqliteConnection();
    let isUserId;

    const { user_id } = request.params;
    const { name, email, password } = request.body;

    if (!user_id || !name || !email) {
      throw new Error('Identificação do usuário é requerida para a atualização')
    }

    let usersExists = await database.all('SELECT * FROM users');
    console.log('USERS EXISTS IN DELETE', usersExists);

    isUserId = usersExists.some(userExists => userExists.id === user_id);

    if (!isUserId) {
      throw new Error('Usuário não identificado')
    };

    const updatedResult = await database.run(`
      UPDATE users SET 
      name = ?, 
      email = ?,
      updated_at = DATETIME('NOW') 
      WHERE id = ?`,
      [name, email, user_id]
    );

    return reponse.json({
      message: 'Informações do usuário atualizadas.',
      data: updatedResult
    })
    
  }

  async delete(request, reponse) {
    const database = await sqliteConnection();
    let isUserId;
    const { user_id } = request.params;

    if (!user_id) {
      throw new Error('Identificação do usuário requerida')
    }

    console.log('USER ID', user_id)

    let usersExists = await database.all('SELECT * FROM users');
    console.log('USERS EXISTS IN DELETE', usersExists)

    isUserId = usersExists.some(userExists => userExists.id === user_id);

    if (isUserId) {
      const result = await database.run('DELETE FROM users WHERE id = ?', [user_id])
      return reponse.json({
        message: 'Usuário excluído com sucesso',
        data: result
      })
    } else {
      return reponse.json({
        message: 'USER ID NOT EXISTS'
      })
    }

  }
}
module.exports = { UsersController };