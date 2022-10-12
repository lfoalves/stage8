const { AppError } = require("../utils/AppError");

function myMiddleware(request, response, next) {
  console.log('Você passou pelo Middleware!');
  const { isAdmin } = request.body;

  if (!isAdmin) {
    throw new AppError('Você não tem permissão', 401)
  }

  next();
}
module.exports = { myMiddleware }