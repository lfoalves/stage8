const createMovieTags = `
  CREATE TABLE IF NOT EXISTS movie_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_id VARCHAR REFERENCES movie_notes(id) ON DELETE CASCADE,
    user_id VARCHAR REFERENCES users(id),
    name VARCHAR NOT NULL
  )
`;

module.exports = { createMovieTags }