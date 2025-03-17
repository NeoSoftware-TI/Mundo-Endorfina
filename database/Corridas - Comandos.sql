use Corridas;

-- ------------------------------------------------------------------------------------------------------------------------------------- INSERT - Inserir Dados nas Tabelas.

-- ---------------------------------------------------------------------- LOGIN
INSERT INTO login (usuario, senha, tipo) VALUES ('cliente1', 'senha123', 'Cliente');
INSERT INTO login (usuario, senha, tipo) VALUES ('subadmin1', 'senha456', 'Sub-Admin');

-- ---------------------------------------------------------------------- SUB-ADMIN
INSERT INTO sub_admin (id_login, nome) VALUES (2, 'Ana Santos');
    
-- ---------------------------------------------------------------------- PESSOAS
INSERT INTO pessoas (nome, email, telefone, id_login) VALUES ('João Silva', 'joao@email.com', '11987654321', 1);
INSERT INTO pessoas (nome, email, telefone, id_login) VALUES ('Ana Santos', 'ana@email.com', '11912345678', 2);

-- ---------------------------------------------------------------------- POSTAGEM
INSERT INTO historico_postagens (id_cliente, conteudo) VALUES (1, 'Correndo 20 KM !!!!!!!!!');

-- ---------------------------------------------------------------------- LINK INSTAGRAM
INSERT INTO redes_sociais (id_usuario, plataforma, link_perfil) VALUES (1, 'Instagram', 'instagram.com/joao');

-- ---------------------------------------------------------------------- METAS
INSERT INTO metas (descricao, pontos, id_subadmin) VALUES ('Concluir 5 postagens', 100, 1);

-- ---------------------------------------------------------------------- LOGIN
INSERT INTO pontos_usuarios (id_usuario, id_meta) VALUES (1, 1);

-- ---------------------------------------------------------------------- LOGIN
INSERT INTO cupons (id_usuario, descricao) VALUES (1, 'Cupom de desconto 10%');

-- ------------------------------------------------------------------------------------------------------------------------------------- SELECT - Dashboard e Busca de dados.

-- ---------------------------------------------------------------------- LOGIN - Todas pessoas registradas no Login
SELECT * FROM login;

-- ---------------------------------------------------------------------- INFORMAÇÕES - Puxa todas informações da Pessoa
SELECT * FROM pessoas WHERE nome = 'João Silva';

-- ---------------------------------------------------------------------- HISTÓRICO - Todas as postagens feitas pelo Cliente.
SELECT * FROM historico_postagens WHERE id_cliente = 1;

-- ---------------------------------------------------------------------- REDES SOCIAIS - Perfis cadastrados na rede social
SELECT * FROM redes_sociais WHERE plataforma = 'Instagram';

-- ---------------------------------------------------------------------- SUB-ADMIN - Exibe os sub-admins cadastrados.
SELECT * FROM sub_admin;

-- ---------------------------------------------------------------------- METAS - Lista todas as metas cadastradas no sistema.
SELECT * FROM metas;

-- ---------------------------------------------------------------------- PONTOS - Mostra os pontos que cada usuário conquistou.
SELECT pontos_usuarios.id_ponto, 
       pontos_usuarios.id_usuario, 
       metas.descricao AS descricao_meta, 
       metas.pontos, 
       pontos_usuarios.data_conquista
FROM pontos_usuarios
JOIN metas ON pontos_usuarios.id_meta = metas.id_meta
ORDER BY metas.pontos DESC;

-- ---------------------------------------------------------------------- CUPONS - Exibe qual usuário recebeu o cupom, a descrição e a data do resgate.
SELECT * FROM cupons;

-- ------------------------------------------------------------------------------------------------------------------------------------- DELETE - Apagar Dados das Tabelas.

--  ------------------------- Delete um ID da Tabela "Admin"
DELETE FROM admin 
WHERE id = 1
AND (
	(SELECT permissao_id FROM admin WHERE id = 1) = 4 -- ------------------------------------------------------------------- Admin (4) pode atualizar qualquer um
);

--  ------------------------- Delete um ID da Tabela "Sub-Admin"
DELETE FROM subadmin
WHERE id = 2
AND (
    (SELECT permissao_id FROM subadmin WHERE id = 2) = 2 AND (SELECT permissao_id FROM subadmin WHERE id = 10) IN (1) -- ---- Sub-Admin (2) pode atualizar Usuario (1)
    OR (SELECT permissao_id FROM subadmin WHERE id = 1) = 3 -- ------------------------------------------------------------------- Admin (3) pode atualizar qualquer um
);

--  ------------------------- Delete um ID da Tabela "Usuario"
DELETE FROM usuario
WHERE id = 5
AND (
    (SELECT permissao_id FROM usuario WHERE id = 2) = 2 AND (SELECT permissao_id FROM usuario WHERE id = 10) IN (1) -- ---- Sub-Admin (2) pode atualizar Usuario (1)
    OR (SELECT permissao_id FROM usuario WHERE id = 1) = 3 -- ------------------------------------------------------------------- Admin (3) pode atualizar qualquer um
);

--  ------------------------- Delete um ID da Tabela "Publicação"
DELETE FROM publicação
WHERE id = 10;

--  ------------------------- Delete um ID da Tabela "Cupons"
DELETE FROM cupons
WHERE id = 10;

-- ------------------------------------------------------------------------------------------------------------------------------------- UPDATE - Atualização de dados.

--  ------------------------- Atualiza um ID da Tabela "Administrador"
UPDATE admin 
SET nome = 'Desenvolvedor', email = 'admin@email.com'
WHERE id = 1
AND (
	(SELECT permissao_id FROM admin WHERE id = 1) = 4 -- ------------------------------------------------------------------- Admin (4) pode atualizar qualquer um
);

--  ------------------------- Atualiza um ID da Tabela "Sub-Admin"
UPDATE subadmin
SET nome = 'Sérgio', email = 'treinador@email.com'
WHERE id = 2
AND (
    (SELECT permissao_id FROM subadmin WHERE id = 2) = 2 AND (SELECT permissao_id FROM subadmin WHERE id = 10) IN (1) -- ---- Sub-Admin (2) pode atualizar Usuario (1)
    OR (SELECT permissao_id FROM subadmin WHERE id = 1) = 3 -- ------------------------------------------------------------------- Admin (3) pode atualizar qualquer um
);

--  ------------------------- Atualiza um ID da Tabela "Usuario"
UPDATE usuario
SET email = 'usuario@hotmail.com'
WHERE id = 5
AND (
    (SELECT permissao_id FROM usuario WHERE id = 2) = 2 AND (SELECT permissao_id FROM usuario WHERE id = 10) IN (1) -- ---- Sub-Admin (2) pode atualizar Usuario (1)
    OR (SELECT permissao_id FROM usuario WHERE id = 1) = 3 -- ------------------------------------------------------------------- Admin (3) pode atualizar qualquer um
);

--  ------------------------- Atualiza um ID da Tabela "Agendamentos"
UPDATE publicação
SET titulo = 'Conteudo Ofensivo'
WHERE id = 10;

--  ------------------------- Atualiza um ID da Tabela "Prontuario"
UPDATE cupons
SET quantidade = '1000000'
WHERE id = 10;