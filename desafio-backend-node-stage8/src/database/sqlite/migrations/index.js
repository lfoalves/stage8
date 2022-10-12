const { sqliteConnection } = require('../../sqlite');

const { createUsers } = require('./createUsers');
const { createMovieNotes } = require('./createMovieNotes');
const { createMovieTags } = require('./createMovieTags');

async function migrationRun() {
  const database = await sqliteConnection();
  await database.exec(createUsers);
  await database.exec(createMovieNotes);
  await database.exec(createMovieTags);
}

module.exports = { migrationRun }