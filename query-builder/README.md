# Aula 1

- SQL Query Builder

- Construtor de consulta.
- Permite construir instruções SQL independente do banco de dados utilizado.

Obs. Por que mesmo entre bancos relacionais existem diferenças. Ex: MySQL, SQLServer, SQLite.
A linguagem é a mesma para os bancos de dados relacionais.

Dar flexibilidade para a aplicação pois possibilidade a mudança da base de dados.

# Aula 2
- Instalando o `https://knexjs.org/guide/#node-js`

# Aula 3
- Configurando o Knex.js
`npx knex init` para gerar o knexfile na raiz do projeto.
Definir no knexfile o caminho do database

# Aula 4
- Migrations
É uma forma de versionar a base de dados.
Manipulação da base de dados: criando, alterando ou removendo.
Métodos:
- UP: cria/altera dados da base. 
- DOWN: rollback, Desfazer alterações realizadas pela migration.

# Aula 5
- Migrations para Notes.
Automatizar a criação de tabelas

`npx knex migrate:make createNotes`
 
 Apoś criar a migration, ir no arquivo e dar os comando na sintaxe knew para gerar as instruções SQL.

# Aula 6
- NPM - Node Package Manager. Gerenciador de pacotes padrão do Node.js. Instala pacotes e módulos no projeto Node. Executa scripts e bibliotecas instaldas.
- NPX - Node Package Execute. Package Runner. Vem com o npm v5.2. Executa pacotes do registro NPM sem sequer instalar o pacote.

# Aula 7
- Primary Key and Foreign Key

A chave primária possui um id único com ela na tabela, já a chave estrangeira faz a referência desse id da chave primária em outras tabelas.

# Aula 8
- Cardinalidade.
Nessa aula aprenderemos o que é Cardinalidade, ou seja a frequência que uma entidade/tabela se relaciona com a outra. Para isso, vamos visualizar a estrutura do nosso banco de dados.

# Aula 9
Migration para Tags e Links

Por padrão a funcionalidade de CASCADE é desabilitada no SQLite.
- Ativa esta funcionalidade no knexfile.js

# Aula 10
Cadastrando notas.

# Aula 11
- Exibindo nota

# Aula 12
- Deletando nota

# Aula 13
- Listando notas
- Usando Query Params
Nessa aula criaremos a rota para listar as notas cadastradas em nosso banco de dados incluindo as tags e links.

# Aula 14
- Operador Like
Usamos a query do request para fazer buscas por palavras chaves usando a sintaxe SQL de % antes e depois da palavra.

`http://localhost:3333/notes?user_id=1&title=banco

# Aula 15
- Filtro WhereIn

Nessa aula utilizaremos o filtro WhereIn para filtrar realmente o que é necessário em nossa busca no banco de dados.


# Aula 16
- Conceito de Inner Join

Nessa aula aprenderemos sobre Inner Join para fazer a junção de duas tabelas e trazer um resultado em conjunto desses dados.

# Aula 17
- Aplicando Inner Join

Nessa aula aplicaremos o Inner Join dentro do nosso projeto unificando os dados das tabelas notes e tags em uma consulta.

# Aula 18
- Map e Filter métodos para Array.

Nessa aula aprenderemos a utilizar a função map e filter utilizando a ferramenta PlayCode.

PlayCode - Javascript Playground: https://playcode.io/

# Aula 19
- Obtend tag de notas.

# Aula 20
- Controller de Tags

# Aula 21
Testando tudo.
Apagando o database e startando a plicação.
API e Backend em Node.

