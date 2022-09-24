# Aula 1 
Banco de Dados -> Coleção de informações

Ex: Lista de telefones, Lista de compras, Lista de convidados.

Dados diversos organizados.

- Estrutura de um Banco de Dados: Tabelas
Ex: Tabela de clientes, tabela de produtos, tabela de vendas.

- Tabelas: Registros em linhas organizada por colunas.

- Banco de Dados Relacional

-> Primary Key, Foreign Key, Cardinalidade: Frequeência de ralacionamento entre tabelas. Ex: um usuário pode ter muitas notas.

# Aula 2
Estrutura da base de dados para a aplicação RocketNotes.
- Planejamento das tabelas, informações e relacionamentos.

# Aula 3
- Criando e conectando o database.
SQLITE

# Aula 4
SGDB -> Sistema gerenciador de banco de dados: BeeKeeper Studio -> Open Source SQL Editor and Database Manager

# Aula 5
- Criando tabela de usuário com o Beekeeper Studio

# Aula 6
- SQL

Linguagem de Consulta Estruturada.
Linguagem padrão para bancos de dados relacionais.
- Comandos DDL
-> Data Definition Language
CREATE, DROP, ALTER

Bancos relacionais que usam SQL: MySQL, Postgre, SQLServer, MariaDB, SQLite, Oracle.

# Aula 7
- ALTER

Nessa aula aprenderemos a alterar o nome das tabelas, adicionar e deletar colunas do banco de dados.

- Alterar nome da tabela:

ALTER TABLE users 
RENAME TO clients

- Adicionando coluna status:

ALTER TABLE users 
ADD status VARCHAR

- Renomeando coluna status :

ALTER TABLE users 
RENAME COLUMN status to active

- Deletando coluna status:

ALTER TABLE users 
DROP COLUMN status


# Aula 8
Nessa aula aprenderemos o significado de SQL (Structured Query Language), ou Linguagem de Consulta Estruturada. É a linguagem padrão para banco de dados relacionais. Também aprenderemos sobre comandos DML (Data Manipulation Language)

C -> Create -> Insert

R -> Read -> Select

U -> Update -> Update

D -> Delete - Delete

# Aula 9
Nessa aula aprenderemos como inserir, buscar, atualizar e deletar os registros na tabela users

- Inserindo dados na tabela users

INSERT INTO users
(name, email, password)
VALUES
('birobirobiro', 'birobirobiro@email.com', '123');

- Buscando registros na tabela users:

SELECT * FROM users;

- Atualizando registros:

UPDATE users SET
avatar = 'birobirobiro.png'
WHERE id = 1

- Deletando registros:

DELETE FROM users 
WHERE id = 

# Aula 10
- Migrations
Criando o database e as tabelas.

# Aula 11
- Select. Método Create do Controller.
