const sqlite3 = require('sqlite3')
const { open } = require('sqlite')


const initDb = {

  async init() {
    const db = await open({
      filename: './src/db/rocketnotes.sqlite',
      driver: sqlite3.Database
    });

    await db.exec (`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VACHAR,
      email VARCHAR,
      password VARCHAR,
      avatar VARCHAR NULL,
      create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.close();
  }
}

initDb.init();