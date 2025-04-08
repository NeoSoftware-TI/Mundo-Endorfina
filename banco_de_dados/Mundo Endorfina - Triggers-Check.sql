-- -------------------------------------------------------------------------------------------------------------------------------- TRIGGER - Os dados que serão automaticamente Acrescentado

-- ---------------------------------------------------------------------- PONTOS - Verifica se essa corrida contribui para alguma meta ativa.
DELIMITER $$

CREATE TRIGGER atualizar_progresso_meta
AFTER INSERT ON feed_usuario
FOR EACH ROW
BEGIN
    UPDATE historico_metas
    SET progresso_atual = progresso_atual + 1
    WHERE id_usuario = NEW.id_usuario
    AND status = 'Em andamento';
END$$

DELIMITER ;

-- ---------------------------------------------------------------------- CHECK - Banco de dados

USE mundo_endorfina;

SELECT * FROM login;
SELECT * FROM pessoas;
SELECT * FROM admin;
SELECT * FROM sub_admin;
SELECT * FROM cliente;
SELECT * FROM post;

SELECT post.*, pessoas.nome, telefone FROM post JOIN pessoas ON (pessoas.id_pessoa = post.id_pessoa);

DROP TABLE post; --   admin, cliente, sub_admin, pessoas, login, post, metas, pontos_usuarios, reacoes_feed, redes_sociais, historico_metas, cupons, historico_postagens;