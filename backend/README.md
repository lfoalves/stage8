# Aula 6
- Rotas e Métodos HTTP

Rota é um caminho para acessar um recurso do servidor.
Méthodo é uma padronização para definir tipos de funcionalidades para as rotas que esperam uma request e devolvem uma response.

- GET -> leitura
- POST -> criação
- PUT -> atualização
- DELETE -> Deleção
- PATCH -> Atualização parcial

# Aula 7
Méthod GET com ExpressJS, usa-se a constante que inicializou o express com o .get que é uma função que espera o path/recurso da rota como primeiro parâmetro e como segundo parâmetro espera uma função que passa como argumentos o request e o response, utilizando-os no escopo.

# Aula 8
Route Params
- Cria se uma rota e passase uma informação pela url dividindo-a por /, para dizer ao express que a rota recebe um parâmetro coloca-se dois pontos e a identificação do parametro
- ex: `http://localhost:3333/products/:id`

<br/>

Recupera-se o valor do parametro com o: 

`request.params.value`

<br/>

Pode-se desestruturar os valores dos parametros de dentro do requisição:

`const { id, user } = request.params;`

Muito usado para informações simples e para casos de listagem de produtos.

# Aula 9
Query Params


# Aula 10
- Nodemon: É uma dependência de desenvolvimento, usamos ela para autoreload da aplicação node, para isso é preciso configura-la no caminho do script de execução do server

`"dev": "nodemon ./src/server.js"`

# Aula 11
- Insomnia

REST Client.
Para teste de rotas da aplicação Node, pois o navegador por padrão usa requisições do métodos GET.

# Aula 12
- Method POST

# Aula 13
- Body Params

Body params com JSON

Resgatar as informações pelo `request.body;`

# Aula 14
Estutura e organização do projeto
- Routes

# Aula 15
CAMADA
- Controllers -> Regras de negócio.

Usando Classes para acessar as cinco principais funções dos métodos HTTP.

# Aula 16
Camada de CONTROLLERS

# Aula 17
- HTTP Codes

# Aula 18
- Middlewares

São funções que tem acesso ao objeto de solicitação (requisição), o objeto da resposta, e a próxima função do middleware no ciclo solicitação-resposta do aplicativo.
A próxima função middleware é comumente denotada por uma variável chamada next.

# Aula 19
- Utilizando 

# Aula 20
- Tratamento de erro do cliente
Criando uma instância de erro.

# Aula 21
Tratamento de exceções
- Instalando lib Express Async Errors

`npm install express-async-errors --save`

como dependencia de produção.

# Aula 22
Configurando o Insomnia: ENVIRONMENTS
- Request Collection Environment: BASE_URL, Folder Environment: RESOURCE.