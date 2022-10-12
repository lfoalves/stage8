const { sqliteConnection } = require("../database/sqlite");
const { AppError } = require('../utils/AppError');

class MoviesTagsController {
  async show(request, response) {
    const database = await sqliteConnection();

    const movieTags = await database.all('SELECT * FROM movie_tags');
    console.log(movieTags)
    await database.close();

    if (movieTags.length <= 0) throw new AppError('Não existem notas criadas');

    return response.json(movieTags)
  }

  async index(request, response) {
    const database = await sqliteConnection();

    const { user_id } = request.params;
    
    const userMovieTags = await database.all('SELECT * FROM movie_tags WHERE user_id = ?', [user_id]);
    console.log(userMovieTags)

    if (userMovieTags.length <= 0) throw new AppError('Não existem tags de notas cadastradas por esse usuários ainda')

    return response.json(userMovieTags)
  }
}

module.exports = { MoviesTagsController }