const { randomUUID } = require('crypto');
const { sqliteConnection } = require('../database/sqlite');
const { AppError } = require('../utils/AppError');

class MoviesNotesController {
  async create(request, response) {
    const database = await sqliteConnection();

    let movieId;
    let isMovieId = true;
    let ratingData;

    const { user_id } = request.params;
    const { title, description, rating, tags } = request.body;

    if (!title || !description || !user_id) {
      throw new Error('Informações são necessárias para cadastrar o filme')
    }

    const userExists = await database.all('SELECT * FROM users WHERE id = ?', [user_id]);

    if (userExists.length <= 0) {
      throw new AppError('Usuário não identificado para a criação da nota para o filme')
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

      await database.close();
  
      return response.status(201).json({
        message: 'Created Movie Note',
        data: insertMovie,
      })
    }        
  }

  async show(request, reponse) {
    const database = await sqliteConnection();

    const { user_id } = request.params;
    if (!user_id) throw new AppError('Identificação do usuário é requerida')

    const userExists = await database.get('SELECT * FROM users WHERE id = ?', [user_id])
    if (!userExists) throw new AppError('Usuário não identificado')

    const userMovies = await database.all(`
      SELECT * 
      FROM movie_notes
      WHERE user_id = ?
      `, [user_id]);

    await database.close();

    if (userMovies.length <= 0) throw new AppError('Não há notas sobre filmes cadastradas ainda por este usuário!')
    
    return reponse.json({userMovies})
  }

  async showAll(request, reponse) {
    const database = await sqliteConnection();

    const allNoteMovies = await database.all(`
      SELECT * FROM movie_notes ORDER BY title
    `)

    if (!allNoteMovies || allNoteMovies.length <= 0) throw new AppError('Não existem notas ainda cadastradas na base de dados')

    return reponse.json({
      message: 'All movies notes',
      data: allNoteMovies
    })
  }

  async index(request, response) {
    const database = await sqliteConnection();

    // http://localhost:3333/notes?user_id=1&title=jokes&tags=node,%20express
    // http://localhost:9999/movies?user_id=a1d1f5e0-c0d3-4c5e-be47-0ee9d577b106&title=fuga&tags=aventura,%20anima%C3%A7%C3%A3o

    const { user_id, title, tags } = request.query;

    if (!user_id) throw new AppError('Necessário a identificação do usuário');
    if (!title) throw new AppError('Necessário palavra chave para a pesquisa');

    const userExist = await database.get('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!userExist) throw new AppError('Usuário não identificado');

    // const userMoviesNotes = await database.all(`
    //   SELECT * FROM movie_notes
    //   JOIN movie_tags
    //   ON movie_notes.id = movie_tags.note_id
    //   WHERE movie_notes.user_id = ?
    //   ORDER BY movie_notes.created_at`,
    //   [user_id]);

      let notes;

      if (tags) {
        const filterTags = tags.split(',').map(tag => tag.trim())
        console.log(filterTags)

        // notes = await database.all(`
        //   SELECT * FROM movie_notes JOIN movie_tags
        //   ON movie_tags.note_id = movie_notes.id
        //   WHERE movie_notes.user_id = ?`,[user_id])
  
        notes = await database.all(`
          SELECT movie_notes.id, movie_notes.title, movie_notes.user_id
          FROM movie_tags
          INNER JOIN movie_notes
          ON movie_tags.note_id = movie_notes.id
          WHERE movie_notes.user_id = ?
          INTERSECT
          SELECT *
          FROM movie_tags
          WHERE name IN (${filterTags.forEach(async tag => tag)})
          `,[user_id])
          console.log('NOTES dentro de se tags', notes)
          
      } else {
          notes = await database.all(`
            SELECT * FROM movie_notes WHERE title LIKE '%${title}%' 
            INTERSECT
            SELECT * FROM movie_notes WHERE user_id = '${user_id}'
        `)
  
        // --->>> SELECT com filtro
        // notes = await database.all(`
        //   SELECT * FROM movie_notes WHERE title LIKE '%${title}%' AND user_id = '${user_id}'
        // `)
  
      }

      const userTags = await database.all('SELECT * FROM movie_tags WHERE user_id = ?', [user_id]);

      const notesWithTags = notes.map(note => {
        const noteTags = userTags.filter(tag => tag.note_id === note.id)

        return {
          ...note,
          tags: noteTags
        }
      })

      console.log({
        message: 'notas filtradas',
        data: notesWithTags
      })
      
      // console.log('NOTES', notes)
      if (notes.length <= 0) throw new AppError('Não existem notas sobre filmes com estas letras')

    await database.close();

    // if (userMoviesNotes.length <= 0) throw new AppError('Não existem notas sobre filmes criadas por esse usuário')

    // return response.json(notes);
    return response.json(notesWithTags);
  }

  async update(request, reponse) {
    const database = await sqliteConnection();

    let resultUpdate;

    const { movie_id } = request.params;
    const { title, description, rating, tags } = request.body;

    if (!movie_id) throw new AppError('Identificação necessária da nota do filme')

    const movieExists = await database.get('SELECT * FROM movie_notes WHERE id = ?', [movie_id]);

    console.log("MOVIE EXISTES", movieExists)

    if (!movieExists) throw new AppError('Nota de filmes não identificada')

    // Variáveis para tratamento de informações em falta
    let titleData = title ? title : movieExists.title;
    let descriptionData = description ? description : movieExists.description;
    let ratingData = rating ? rating : movieExists.rating;

    // console.log('DATA')
    // console.log(titleData, descriptionData, ratingData)
    
    if (movieExists) {
      resultUpdate = await database.run(`
        UPDATE movie_notes SET
        title = ?,
        description = ?,
        rating = ?,
        updated_at = DATETIME('NOW')
        WHERE id = ?`,
        [titleData, descriptionData, ratingData, movie_id]);

        // OBS ATUALIZAR TAGS
      }

      await database.close();
      
      return reponse.status(201).json({
        message: 'Updated Movie',
        data: resultUpdate
      });
  }

  async delete(request, reponse) {
    const database = await sqliteConnection();
    const { movie_id } = request.params;

    if (!movie_id) {
      throw new Error('Identificação do filmes é necessaŕia')
    }
    
    const movieNoteExists = await database.get('SELECT * FROM movie_notes WHERE id = ?', [movie_id]);
    // console.log('MOVIE NOTE DELETE', movieNoteExists)
    if (!movieNoteExists) throw new AppError('Não foi possível identificar a nota do filme para a exclusão')

    if (movieNoteExists) {
      await database.run('PRAGMA foreign_keys = ON');
      const movieDeleted = await database.run('DELETE FROM movie_notes WHERE id = ?', [movie_id]);
      return reponse.json({
        message: 'Deleted Movie',
        data: movieDeleted
      })
    }
      
    await database.close();
    }    
  }

module.exports = { MoviesNotesController }