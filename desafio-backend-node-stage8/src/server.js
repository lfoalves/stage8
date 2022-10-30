require('express-async-errors');
const express = require('express');
const { routes } = require('./routes');
const { migrationRun } = require('./database/sqlite/migrations');
const { AppError } = require('./utils/AppError');
const cors = require('cors');

const app = express();

migrationRun();

app.use(express.json())

app.use(cors({
  origin: 'http://127.0.0.1:5173'
}))

app.use(routes);

// Tratando Exceções
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });    
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
})

const PORT = 9999;
app.listen(PORT, () => console.log('Server is running on port', PORT));

process.on('uncaughtException', (err) => console.log('Error no servidor', err));