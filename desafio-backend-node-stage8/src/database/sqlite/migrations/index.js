const { sqliteConnection } = require('../../sqlite');

const { createUsers } = require('./createUsers');
const { createMovieNotes } = require('./createMovieNotes');
const { createMovieTags } = require('./createMovieTags');

async function migrationRun() {
  const schemas = [
    createUsers,
    createMovieNotes,
    createMovieTags
  ].join('');

  sqliteConnection()
  .then(db => db.exec(schemas))
  .catch((error) => console.error(error));
}

module.exports = { migrationRun }