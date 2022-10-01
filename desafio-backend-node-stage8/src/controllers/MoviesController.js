const { randomUUID } = require('crypto');
const { sqliteConnection } = require('../database/sqlite');

class MoviesController {
  async create(request, response) {
    const database = await sqliteConnection();

    let movieId;
    let isMovieId = true;

    const { user_id } = request.params;
    const { title, description, tags } = request.body;

    if (!title || !description || !user_id) {
      throw new Error('Informações são necessárias para cadastrar o filme')
    }

    const movies = await database.all('SELECT * FROM movie_notes');
    // const movies = await database.all('SELECT id FROM movie_notes WHERE id LIKE ?', [id]);

    while (isMovieId) {
      movieId = randomUUID();
      isMovieId = movies.some(movie => movie.id === movieId);
    }

    if (!isMovieId) {
      const insertMovie = await database.run(`
        INSERT INTO movie_notes (
          id, title, description, user_id
        ) VALUES ( ?, ?, ?, ?)`,
        [movieId, title, description, user_id]
      );

      console.log("TAGS INSERT", tags)

      tags.forEach(async tag => {
        await database.run(`
        INSERT INTO movie_tags (
          note_id, user_id, name
          ) VALUES (?, ?, ?)`,
          [movieId, user_id, tag]
        );
      })
  
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

  async delete(request, reponse) {
    console.log('METHOD DELETE MOVIES')
    const database = await sqliteConnection();
    const { movie_id } = request.params;
    let isMovieId = true;

    if (!movie_id) {
      throw new Error('Identificação do filmes é necessaŕia')
    }

    
    const moviesExists = await database.all('SELECT * FROM movie_notes');
    console.log("DELETE MOVIE", moviesExists);

    if (!moviesExists) {
      throw new Error('Identificação do filme é necessária para a deleção')
    };

    while (isMovieId) {
      isMovieId = moviesExists.some(movie => movie.id === movie_id);
    }
    
    // const movies = await database.all('SELECT id FROM movie_notes WHERE id LIKE ?', [id]);

    await database.run('PRAGMA foreign_keys = ON');
    const movieDeleted = await database.run('DELETE FROM movie_notes WHERE id = ?', [movie_id]);
    
    return reponse.json({
      message: movieDeleted
    })
  }

}

module.exports = { MoviesController }