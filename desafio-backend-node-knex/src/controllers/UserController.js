const { AppError } = require('../utils/AppError');
const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex')

class UserController {
  async create(request, response) {

    const { name, email, password } = request.body;

    if (!name || !email || !password) throw new AppError('Informações do usuário são necessárias para a criação do cadastro')

    const hashedPassword = await hash(password, 8)

    const userEmailExists = await knex.connection('users').where({email})
    if (userEmailExists.length > 0 && userEmailExists[0].email === email) throw new AppError('E-mail já em uso')

    await knex.connection('users').insert({
      name,
      email,
      password: hashedPassword
    })
    
    return response.status(201).json('user created')
  }

  async show(request, response) {
    const users = await knex.connection('users').orderBy('created_at');

    if (users.length <= 0) throw new AppError('Não existem usuário cadastrados ainda')

    return response.json({
      message: 'show users',
      data: users
    })
  }

  async update(request, response) {
    const { name, email, oldPassword, newPassword } = request.body;
    const { user_id } = request.params;

    if (!user_id) throw new AppError('Identificação do usuário é necessária')
    if (!oldPassword || !newPassword) throw new AppError('Senhas são necessárias')

    const userExists = await knex.connection('users').where({id: user_id})
    if (userExists.length <= 0) throw new AppError('Usuário não identificado')
    
    const checkOldPassword = await compare(oldPassword, userExists[0].password)
    if (!checkOldPassword) throw new AppError('Senhas não conferem')

    const emailData = email ? email : userExists[0].email

    const checkEmailExists = await knex.connection('users').where({email: emailData})
    if (checkEmailExists.length > 0) {
      if (checkEmailExists[0].id !== user_id) {
        throw new AppError('E-mail pertence a outro usuário')
      }      
    }

    const nameData = name ? name : userExists[0].name
    const passwordData  = checkOldPassword ? await hash(newPassword, 8) : userExists[0].password

    const updatedUser = await knex.connection('users').where({id: user_id}).update({
      name: nameData,
      email: emailData,
      password: passwordData,
      updated_at: knex.connection.fn.now()
    });

    return response.json({
      message: 'user updated',
      info: updatedUser
    })
  }

  async delete(request, response) {
    const { user_id } = request.params;

    if (!user_id) throw new AppError('Identificação do usuário é requerida')

    const userDeleted = await knex.connection('users').where({id: user_id}).delete();

    return response.json({
      message: 'user deleted',
      info: userDeleted
    })
  }
}

module.exports = { UserController }