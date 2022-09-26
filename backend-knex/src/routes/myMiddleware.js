function myMiddleware(request, response, next) {
  console.log('Você passou pelo middleware')

  if (!request.body.isAdmin) {
    return response.status(401).json({message: 'Unauthorized'})
  }
  
  next();
}

module.exports = myMiddleware;