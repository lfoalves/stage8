require('express-async-errors')
const express = require('express');
const app = express()
const { routes } = require('./routes');
const { migrationRun } = require('./database/sqlite/migrations');

migrationRun();

app.use(express.json())
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => console.log('Server is running on port', PORT))