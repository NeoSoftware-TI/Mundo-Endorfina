-- PASSOS PARA CRIAR O BANCO DE DADOS

-- 1° CRIE O BANCO DE DADOS NO CÓDIGO ABAIXO:
CREATE DATABASE mundo_endorfina;
-- 2° USE O BANCO DE DADOS QUE ACABOU DE CRIAR NO CÓDIGO ABAIXO:
USE mundo_endorfina;
-- ---------------------------------------------------------------------- CHECK - Banco de dados
SELECT * FROM login;
SELECT * FROM pessoas;
SELECT * FROM admin;
SELECT * FROM sub_admin;
SELECT * FROM cliente;
SELECT * FROM post;
SELECT * FROM cupons;
SELECT * FROM excluidos;
-- ---------------------------------------------------------------------- CHECK - APIs
SELECT login.id_login, login.senha, login.tipo, pessoas.id_pessoa FROM login JOIN pessoas ON login.id_login = pessoas.id_login WHERE login.email = 'tiagofreitasmachado@hotmail.com';
SELECT post.*, pessoas.nome, telefone FROM post JOIN pessoas ON (pessoas.id_pessoa = post.id_pessoa);

DROP TABLE pessoas, login, cliente, admin, sub_admin, post, cupons, excluidos; -- pessoas, login, cliente, admin, sub_admin, post, cupons, excluidos, pontos_usuarios, reacoes_feed, redes_sociais, historico_metas, historico_postagens;
DROP TABLE pessoas, login;
DROP TABLE post;

ALTER TABLE pessoas
ADD COLUMN foto_url VARCHAR(255) DEFAULT NULL AFTER telefone;