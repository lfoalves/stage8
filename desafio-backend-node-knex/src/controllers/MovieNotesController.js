const { AppError } = require('../utils/AppError')
const knex = require('../database/knex')

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    if (!user_id) throw new AppError('Identificação do usuário necessária')
    if (!title) throw new AppError('Título para a nota é necessária')

    const descriptionData = description ? description : null
    const ratingData = rating ? rating : null
    
    const note_id = await knex.connection('movie_notes').insert({
      title,
      description: descriptionData,
      rating: ratingData,
      user_id   
    })

    const tagsInsert = tags ? tags.map(name => {
      return {
        note_id,
        user_id,
        name 
      }
    }) : null

    const tagsCreated = tags ? await knex.connection('movie_tags').insert(tagsInsert) : 'Nenhuma tag criada';

    return response.json({
      message: 'movie note created',
      data: {
        tagsInsert,
        tagsCreated
      }
    })

  }

  async show(request, response) {
    const { note_id } = request.params;

    if (!note_id) throw new AppError('Identificação da nota é necessária')

    const note = await knex.connection('movie_notes').where({ id: note_id }).first()
    if (!note || note.length <= 0) throw new AppError('Nota não identificada')

    const tags = await knex.connection('movie_tags').where({ note_id }).orderBy('name')

    return response.json({
      ...note, tags
    })
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query;

    if (!user_id) throw new AppError('Identificação do usuário é necessária')

    let notes;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex.connection('movie_tags')
      .whereIn('name', filterTags)
      // .select([
      //   'movie_notes.id',
      //   'movie_notes.name',
      //   'movie_notes.user_id'
      // ])
        // .where('movie_notes.user_id', '=', user_id)
        // .where({ user_id })
        // .whereLike('movie_notes.title', `%${title}%`)
        // .innerJoin('movie_note', )
    } else {
      notes = await knex.connection('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')        
    }

    return response.json({
      notes
    })
  }
}

module.exports = { MovieNotesController }