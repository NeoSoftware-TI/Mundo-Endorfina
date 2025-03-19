-- -------------------------------------------------------------------------------------------------------------------------------- TRIGGER - Os dados que serão automaticamente Acrescentado

-- ---------------------------------------------------------------------- PONTOS - Gera Cupom ao atingir 500 Pontos.
DELIMITER $$
CREATE TRIGGER gerar_cupom_automatico
AFTER INSERT ON pontos_usuarios
FOR EACH ROW
BEGIN
    DECLARE total_pontos INT;
    SELECT SUM(m.pontos) INTO total_pontos
    FROM pontos_usuarios puUSE mundo_endorfina;

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
    JOIN metas m ON pu.id_meta = m.id_meta
    WHERE pu.id_usuario = NEW.id_usuario;

    IF total_pontos >= 500 THEN
        INSERT INTO cupons (id_usuario, descricao) 
        VALUES (NEW.id_usuario, 'Cupom especial por atingir 500 pontos!');
    END IF;
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