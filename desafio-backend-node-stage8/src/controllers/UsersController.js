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

    const { user_id } = request.params;
    const { name, newEmail, oldPassword, newPassword } = request.body;

    if (!user_id || !oldPassword) {
      return reponse.json({
        message: 'Identificação do usuário ou senha antiga é/são requerida(s) para a atualização'
      })
    }

    const userIdExists = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);
    const usersEmailExists = await database.all('SELECT email FROM users');
    console.log('USER Id EXISTS', userIdExists)
    console.log('USER EMAIL EXISTS', usersEmailExists)

    if (userIdExists.length > 0) {
      if (userIdExists[0].id === user_id) {

        let passwordMatchOldAndNew = await compare(oldPassword, userIdExists[0].password);
        let isEmailMatchExistsInDatabase = usersEmailExists.some(userEmailExists => userEmailExists.email === newEmail)

        // verifica se a senha atual confere com a senha atual recebida do usuário
        if (!passwordMatchOldAndNew) {
          return reponse.json({
            message: "Senha atual não confere!"
          })
        }

        // verifica se o email já está em uso
        if (isEmailMatchExistsInDatabase) {
          return reponse.json({
            message: 'Email já em uso'
          })
        }

        let nameData = name ? name : userIdExists[0].name;
        let emailData = newEmail ? newEmail : userIdExists[0].email;
        let passwordData = newPassword ? await hash(newPassword, 8) : userIdExists[0].password;
        
        console.log("Tratamento dos dados:", '\n', nameData, '\n', emailData, '\n', passwordData)

        await database.run(`
          UPDATE users SET 
          name = ?, 
          email = ?,
          password = ?,
          updated_at = DATETIME('NOW')
          WHERE id = ?`,
          [nameData, emailData, passwordData, user_id]
        );
        return reponse.json(
          {
            message: 'Informações do usuário atualizadas.',
            infos: [
              {name: nameData}, 
              {email: emailData}, 
              {password: passwordData}, 
              {userId: user_id}
            ]
          }
        );

      } else {
        return reponse.json({
          message: 'Id não deu match!'
        });
      }
    } else {
      return reponse.json({
        message: 'Usuário não identificado!'
      });
    }    
  }

  async updatePassword(request, response) {
    const database = await sqliteConnection();

    const { oldpassword, newpassword } = request.body;
    const { user_id } = request.params;
    let isMatchPass = false;

    const user = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);
    
    if (!user) {
      throw new Error('Identificação do usuario é requerida')
    }

    if (user.length > 0) {
      user.map(async user => {
        isMatchPass = await compare(oldpassword, user.password);
        // console.log('Dentro do map User')
        // console.log(isMatchPass)
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