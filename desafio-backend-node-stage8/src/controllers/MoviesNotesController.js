const { randomUUID } = require('crypto');
const { sqliteConnection } = require('../database/sqlite');

class MoviesNotesController {
  async create(request, response) {
    const database = await sqliteConnection();

    let movieId;
    let isMovieId = true;
    let ratingData;

    const { user_id } = request.params;
    const { title, description, rating, tags } = request.body;

    const userExists = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);

    if (!title || !description || !user_id) {
      throw new Error('Informações são necessárias para cadastrar o filme')
    }

    if (userExists.length <= 0) {
      return response.status(400).json({
        message: 'Usuário não identificado para a criação da nota para o filme'
      })
    }

    const movies = await database.all('SELECT * FROM movie_notes');

    while (isMovieId) {
      movieId = randomUUID();
      isMovieId = movies.some(movie => movie.id === movieId);
    }

    ratingData = rating ? rating : null; 

    if (!isMovieId) {
      const insertMovie = await database.run(`
        INSERT INTO movie_notes (
          id, title, description, rating, user_id
        ) VALUES ( ?, ?, ?, ?, ?)`,
        [movieId, title, description, ratingData, user_id]
      );

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
        data: insertMovie,
      })
    }        
  }

  async show(request, reponse) {
    const database = await sqliteConnection();

    const movies = await database.all('SELECT id, title, description FROM movie_notes');

    if (movies.length <= 0) {
      return reponse.json({
        message: 'Não há filmes ainda cadastrados!'
      })
    } else {
      return reponse.json(movies)
    }
  }

  async index(request, response) {
    const database = await sqliteConnection();

    const { user_id } = request.params;

    const userMoviesNotes = await database.all('SELECT * FROM movie_notes WHERE user_id = ?', [user_id]);
    console.log(userMoviesNotes);

    return response.json(userMoviesNotes);
  }

  async update(request, reponse) {
    const database = await sqliteConnection();
    const { movie_id } = request.params;
    const { title, description, tags } = request.body;

    const moviesExists = await database.all('SELECT * FROM movie_notes WHERE id = ?', [movie_id])
    console.log(moviesExists)
  }

  async delete(request, reponse) {
    const database = await sqliteConnection();
    const { movie_id } = request.params;
    let isMovieId = true;

    if (!movie_id) {
      throw new Error('Identificação do filmes é necessaŕia')
    }
    
    const moviesExists = await database.all('SELECT * FROM movie_notes WHERE id = ?', [movie_id]);

    if (moviesExists.length > 0) {
      if (moviesExists[0].id === movie_id) {
        await database.run('PRAGMA foreign_keys = ON');
        const movieDeleted = await database.run('DELETE FROM movie_notes WHERE id = ?', [movie_id]);
        return reponse.json({
          message: 'Deleted Movie',
          data: movieDeleted
        })
      }
    } else {
      return reponse.status(403).json({
        message: 'Não foi possível identificar o vídeo para a exclusão'
      })
    }

    while (isMovieId) {
      isMovieId = moviesExists.some(movie => movie.id === movie_id);
    }
    
    // const movies = await database.all('SELECT id FROM movie_notes WHERE id LIKE ?', [id]);

    
  }
}

module.exports = { MoviesNotesController }