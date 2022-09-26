const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(request, reponse) {
    const {title, description, tags, links} = request.body;
    const { user_id } = request.params;

    console.log(title, description, tags, links, user_id)

    if (!title || !description || !tags || !links || !user_id) {
      throw new AppError('Informações são necessárias')
    }
    
    const note_id = await knex('notes').insert({
      title,
      description,
      user_id
    });

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link 
      }
    });

    await knex('links').insert(linksInsert);

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await knex('tags').insert(tagsInsert);

    reponse.json({
      linksInsert, tagsInsert, title, description
    })
  }

  async show(request, reponse) {
    const id = request.params.note_id;

    const note = await knex('notes').where({ id: id }).first();
    const tags = await knex('tags').where({ note_id: id }).orderBy('name');
    const links = await knex('links').where({ note_id: id }).orderBy('created_at');

    return reponse.json({...note, tags, links})
  }

  async delete(request, reponse) {
    const id = request.params.note_id;

    await knex('notes').where({ id: id }).delete();

    return reponse.json({
      message: 'Note Deleted'
    });
  }
}

module.exports = NotesController;