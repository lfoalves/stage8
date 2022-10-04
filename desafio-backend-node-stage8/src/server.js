require('express-async-errors')
const express = require('express');
const { routes } = require('./routes');
const { migrationRun } = require('./database/sqlite/migrations');

const app = express();

migrationRun();

app.use(express.json())
app.use(routes);

const PORT = 9999;
app.listen(PORT, () => console.log('Server is running on port', PORT))