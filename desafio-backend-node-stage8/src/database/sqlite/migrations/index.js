const { sqliteConnection } = require('../../sqlite');

const { createUsers } = require('./createUsers');
const { createMovieNotes } = require('./createMovieNotes');
const { createMovieTags } = require('./createMovieTags');

async function migrationRun() {
  const database = await sqliteConnection();
  database.exec(createUsers);
  database.exec(createMovieNotes);
  database.exec(createMovieTags);
}

module.exports = { migrationRun }