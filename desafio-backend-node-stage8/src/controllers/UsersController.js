const { sqliteConnection } = require('../database/sqlite');
const { AppError } = require('../utils/AppError');
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
      throw new AppError('Informações do usuário são necessárias para criação')
    }

    let usersExists = await database.all('SELECT * FROM users');
    // console.log('USERS EXISTS', usersExists)

    while (isUserId) {
      id = randomUUID();
      isUserId = usersExists.some(userExists => userExists.id === id);
    }

    let isUserEmailExists = usersExists.some(userEmailExists => userEmailExists.email === email);
    
    // console.log(isUserId, isUserEmailExists)

    if (isUserEmailExists) {
      throw new AppError('Email já em uso');
    }

    hashedPassword = await hash(password, 8)
    
    if (!isUserId && !isUserEmailExists) {
      const result = await database.run(`
        INSERT INTO users (
          id, name, email, password
          ) VALUES (
            ?, ?, ?, ?
          )`, [id, name, email, hashedPassword]
        );

      await database.close();
  
      return reponse.status(201).json({
        message: "Usuário criado com sucesso",
        data: result,
        infos: {
          name: name,
          email: email
        }
      })
    }
  }

  async show(request, reponse) {
    const database = await sqliteConnection();

    const users = await database.all(`
      SELECT id, name, email, password, created_at
      FROM users ORDER BY created_at`
    );

    // console.log(users)
    await database.close();

    return reponse.json({
      message: 'All users',
      data: users
    })
  }

  async update(request, reponse) {
    const database = await sqliteConnection();

    const { user_id } = request.params;
    const { name, newEmail, oldPassword, newPassword } = request.body;

    if (!user_id || !oldPassword) {
      throw new AppError('Identificação do usuário ou senha antiga é/são requerida(s) para a atualização')
    }

    const userIdExists = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);
    const usersEmailExists = await database.all('SELECT email FROM users');
    // console.log('USER Id EXISTS', userIdExists)
    // console.log('USER EMAIL EXISTS', usersEmailExists)

    if (userIdExists.length > 0) {
      if (userIdExists[0].id === user_id) {

        let passwordMatchOldAndNew = await compare(oldPassword, userIdExists[0].password);
        let isEmailMatchExistsInDatabase = usersEmailExists.some(userEmailExists => userEmailExists.email === newEmail)

        // verifica se a senha atual confere com a senha atual recebida do usuário
        if (!passwordMatchOldAndNew) {
          throw new AppError("Senha atual não confere")
        }

        // verifica se o email já está em uso
        if (isEmailMatchExistsInDatabase) {
          throw new AppError('Email já em uso')
        }

        // Variáveis para tratamento de informações em falta
        let nameData = name ? name : userIdExists[0].name;
        let emailData = newEmail ? newEmail : userIdExists[0].email;
        let passwordData = newPassword ? await hash(newPassword, 8) : userIdExists[0].password;
        
        // console.log("Tratamento dos dados:", '\n', nameData, '\n', emailData, '\n', passwordData)

        await database.run(`
          UPDATE users SET 
          name = ?, 
          email = ?,
          password = ?,
          updated_at = DATETIME('NOW')
          WHERE id = ?`,
          [nameData, emailData, passwordData, user_id]
        );

        await database.close();

        return reponse.json({
          message: 'Informações do usuário atualizadas',
            infos: {
              name: nameData, 
              email: emailData
            }
        });

      } else {
        throw new AppError('Id não deu match')
      }
    } else {
      throw new AppError('Usuário não identificado')
    }    
  }

  async updatePassword(request, response) {
    const database = await sqliteConnection();

    const { oldpassword, newpassword } = request.body;
    const { user_id } = request.params;
    let isMatchPass = false;

    if (!user_id || !oldpassword || !newpassword) {
      throw new AppError('Informações são necessárias');
    }

    const user = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);
    // console.log(user)
    
    if (user.length > 0) {
      user.map(async user => {
        isMatchPass = await compare(oldpassword, user.password);
        // console.log('Dentro do map User')
        // console.log(isMatchPass)
        if (isMatchPass) {
          let newPasswordCrypted = await hash(newpassword, 8)
          await database.run(`
            UPDATE users
            SET password = ?,
            updated_at = DATETIME('NOW')
            WHERE id = ?`,
            [newPasswordCrypted, user.id]
          );
          await database.close();

          return response.json({
            message: 'Senha do usuário alterada com sucesso!'
          })
        } else {
          throw new AppError('Senhas não conferem')
        }
      })
    } else {
      throw new AppError('Usuário não identificado')
    }
  }

  async delete(request, reponse) {
    const database = await sqliteConnection();
    let isUserId;
    const { user_id } = request.params;

    if (!user_id) {
      throw new AppError('Identificação do usuário requerida')
    }

    // console.log('USER ID', user_id)

    let usersExists = await database.all('SELECT * FROM users');
    // console.log('USERS EXISTS IN DELETE', usersExists)

    isUserId = usersExists.some(userExists => userExists.id === user_id);

    if (isUserId) {
      await database.run('PRAGMA foreign_keys = ON');
      const result = await database.run('DELETE FROM users WHERE id = ?', [user_id]);
      await database.close();
      
      return reponse.json({
        message: 'Usuário excluído com sucesso',
        data: result
      })
    } else {
      throw new AppError('User ID not exists')
    }

  }
}
module.exports = { UsersController };