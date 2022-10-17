const { sqliteConnection } = require("../database/sqlite");
const { AppError } = require('../utils/AppError');

class MoviesTagsController {
  async show(request, response) {
    const database = await sqliteConnection();

    const movieTags = await database.all('SELECT * FROM movie_tags');
    await database.close();

    if (movieTags.length <= 0) throw new AppError('Não existem notas criadas');

    return response.json({
      message: 'All movie tags',
      data: movieTags
    })
  }

  async index(request, response) {
    const database = await sqliteConnection();

    const { user_id } = request.params;
    
    if (!user_id) throw new AppError('Identificação do usuário é requerida')

    const userExists = await database.get('SELECT * FROM users WHERE id = ?', [user_id])
    if (!userExists) throw new AppError('Usuário não identificado')
    
    const userMovieTags = await database.all('SELECT * FROM movie_tags WHERE user_id = ?', [user_id]);

    if (userMovieTags.length <= 0) throw new AppError('Não existem tags de notas cadastradas por esse usuários ainda')

    return response.json(userMovieTags)
  }
}

module.exports = { MoviesTagsController }