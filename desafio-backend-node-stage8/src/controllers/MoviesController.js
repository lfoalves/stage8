const { randomUUID } = require('crypto');
const { sqliteConnection } = require('../database/sqlite');

class MoviesController {
  async create(request, response) {
    const database = await sqliteConnection();

    let id;
    let isMovieId = true;

    const { user_id } = request.params;
    const { title, description, tags } = request.body;

    if (!title || !description || !user_id) {
      throw new Error('Informações são necessárias para cadastrar o filme')
    }

    const movies = await database.all('SELECT * FROM movie_notes');

    while (isMovieId) {
      id = randomUUID();
      isMovieId = movies.some(movie => movie.id === id);
    }

    if (!isMovieId) {
      const insertMovie = await database.run(`
        INSERT INTO movie_notes (
          id, title, description, user_id
        ) VALUES ( ?, ?, ?, ?)`,
        [id, title, description, user_id]
      );

      let movieNotesId = randomUUID();

      const tagsInsert = tags.map(name => {
        return {
          movieNotesId,
          id,
          user_id,
          name
        }
      })

      await database.run(`
        INSERT INTO movie_tags (
          id, note_id, user_id, name
          ) VALUES (? , ?, ?, ?)`,
          [movieNotesId, id, user_id, tagsInsert]
      );
  
      return response.json({
        message: 'Created Movie Note',
        data: insertMovie
      })
    }        
  }

  async show(request, reponse) {
    const database = await sqliteConnection();

    const movies = await database.all('SELECT id, title, description FROM movie_notes');

    return reponse.json(movies)
  }

}

module.exports = { MoviesController }