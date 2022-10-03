const createMovieNotes = `
  CREATE TABLE IF NOT EXISTS movie_notes (
    id VARCHAR PRIMARY KEY NOT NULL,
    title VARCHAR,
    description VARCHAR,
    rating INTEGER,
    user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

module.exports = { createMovieNotes }