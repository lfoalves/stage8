const {sqliteConnection} = require('../database/sqlite')
const { randomUUID } = require('crypto');
const { hash, compare } = require('bcryptjs');
class UsersController {
  async create(request, reponse) {
    const database = await sqliteConnection();
    let id = randomUUID();
    let isUserId = true;
    let hashedPassword;

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

    hashedPassword = await hash(password, 8)
    
    if (!isUserId && !isUserEmail) {
      const result = await database.run(`
        INSERT INTO users (
          id, name, email, password
          ) VALUES (
            ?, ?, ?, ?
          )`, [id, name, email, hashedPassword]
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
      SELECT id, name, email, password, created_at
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

  async updatePassword(request, response) {
    const database = await sqliteConnection();

    const { oldpassword, newpassword } = request.body;
    const { user_id } = request.params;
    let isMatchPass = false;

    console.log("OLD E NEW PASSWORD", oldpassword, newpassword)

    const user = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);
    
    if (!user) {
      throw new Error('Identificação do usuario é requerida')
    }

    if (user.length > 0) {
      user.map(async user => {
        isMatchPass = await compare(oldpassword, user.password);
        console.log('Dentro do map User')
        console.log(isMatchPass)
        if (isMatchPass) {
          let newPasswordCrypted = await hash(newpassword, 8)
          database.run('UPDATE users SET password = ? WHERE id = ?', [newPasswordCrypted, user.id])

          return response.json({
            message: 'Senha do usuário alterada com sucesso!'
          })
        } else {
          return response.json({
            message: 'Senhas não conferem.'
          })
        }
      })
    } else {
      return response.json({
        message: 'Usuário não identificado'
      })
    }
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
      await database.run('PRAGMA foreign_keys = ON');
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