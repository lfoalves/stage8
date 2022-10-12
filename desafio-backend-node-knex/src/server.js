require('express-async-errors');
const express = require('express');
const app = express();
const { routes } = require('./routes');
const { AppError } = require('./utils/AppError');
// const database = require('./database/sqlite')

// database();
app.use(express.json())
app.use(routes)

// Tratamento de exceções
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})


const PORT = 5050;
app.listen(PORT, () => console.log('Server is running on PORT', PORT))

process.on('uncaughtException', (err) => console.error(err))