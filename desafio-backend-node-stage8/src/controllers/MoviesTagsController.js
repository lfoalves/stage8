const { sqliteConnection } = require("../database/sqlite");

class MoviesTagsController {
  async show(request, response) {
    const database = await sqliteConnection();

    const movieTags = await database.all('SELECT * FROM movie_tags');
    console.log(movieTags)

    return response.json(movieTags)
  }

  async index(request, response) {
    const database = await sqliteConnection();

    const { user_id } = request.params;
    
    const userMovieTags = await database.all('SELECT * FROM movie_tags WHERE user_id = ?', [user_id]);
    console.log(userMovieTags)

    return response.json(userMovieTags)
  }
}

module.exports = { MoviesTagsController }