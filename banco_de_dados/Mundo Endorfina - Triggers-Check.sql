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

-- ---------------------------------------------------------------------- RESTRIÇÃO DE REGISTROS - Somente Sub-Admin pode registrar pessoas.
DELIMITER $$
CREATE TRIGGER restricao_registro_pessoas
BEFORE INSERT ON pessoas
FOR EACH ROW
BEGIN
    DECLARE tipo_usuario VARCHAR(20);
    SELECT tipo INTO tipo_usuario FROM login WHERE id_login = NEW.id_login;

    IF tipo_usuario != 'Sub-Admin' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Somente Sub-Admins podem registrar novas pessoas';
    END IF;
END$$
DELIMITER ;

-- ---------------------------------------------------------------------- CHECK - Banco de dados

CREATE DATABASE mundo_endorfina;

USE mundo_endorfina;

SELECT * FROM pessoas;

SHOW DATABASES;

DROP TABLE pessoas, login, metas, pontos_usuarios, reacoes_feed, redes_sociais, sub_admin, historico_metas, historico_postagens, cupons, feed_usuario;