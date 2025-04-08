-- ---------------------------------------------------------------------- LOGIN - Listar todas as entradas.
CREATE TABLE login (
    id_login INTEGER AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('Visitante','Cliente', 'Sub-Admin', 'Admin') NOT NULL
);

-- ---------------------------------------------------------------------- ADMIN - Onde todos Admin irão estar registrados.
CREATE TABLE admin (
    id_admin INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_login) REFERENCES login(id_login),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- SUB-ADMIN - Onde todos Sub-Admin irão estar registrados.
CREATE TABLE sub_admin (
    id_subadmin INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_login) REFERENCES login(id_login),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- SUB-ADMIN - Onde todos Sub-Admin irão estar registrados.
CREATE TABLE cliente (
    id_cliente INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_login) REFERENCES login(id_login),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- PESSOAS - Todos os indivíduos cadastrados.
CREATE TABLE pessoas (
    id_pessoa INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    senha VARCHAR(100) NOT NULL,
    id_login INTEGER,
    FOREIGN KEY (id_login) REFERENCES login(id_login)
);

-- ---------------------------------------------------------------------- INFORMAÇÕES DE POST - Aqui armazena as informações de Tempo de Corrida, KM e Foto da Corrida.
CREATE TABLE post (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INTEGER,
    tempo_corrida TIME NOT NULL,
    km_percorridos DECIMAL(5,2) NOT NULL,
    foto_corrida VARCHAR(255),
    local VARCHAR(100),
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    titulo VARCHAR(100),
    status ENUM('Aprovada', 'Pendente', 'Rejeitada') DEFAULT 'Pendente',
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- REDES SOCIAIS - Comunicação entre as Pessoas.
CREATE TABLE redes_sociais (
    id_social INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER,
    plataforma VARCHAR(50) NOT NULL,
    link_perfil VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES pessoas(id_pessoa)
);

-- ---------------------------------------------------------------------- HISTÓRICO DE POSTAGENS - Registro de todas Postagens.
CREATE TABLE historico_postagens (
    id_postagem INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_cliente INTEGER,
    conteudo TEXT NOT NULL,
    data_postagem DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES pessoas(id_pessoa)
);

-- ---------------------------------------------------------------------- METAS - Objetivos a serem alcançados.
CREATE TABLE metas (
    id_meta INTEGER AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    pontos INTEGER NOT NULL,
    id_subadmin INTEGER,
    FOREIGN KEY (id_subadmin) REFERENCES sub_admin(id_subadmin)
);

-- ---------------------------------------------------------------------- METAS HISTÓRICO - Permite o Sub-Admin acompanhe melhor quais metas já foram atingidas e quais estão em andamento.
CREATE TABLE historico_metas (
    id_historico INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER,
    id_meta INTEGER,
    progresso_atual INTEGER DEFAULT 0,
    status ENUM('Em andamento', 'Concluída') DEFAULT 'Em andamento',
    FOREIGN KEY (id_usuario) REFERENCES pessoas(id_pessoa),
    FOREIGN KEY (id_meta) REFERENCES metas(id_meta)
);

-- ---------------------------------------------------------------------- PONTOS OBTIDOS - Onde os pontos vão ser registrados.
CREATE TABLE pontos_usuarios (
    id_ponto INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER,
    id_meta INTEGER,
    data_conquista DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES pessoas(id_pessoa),
    FOREIGN KEY (id_meta) REFERENCES metas(id_meta)
);

-- ---------------------------------------------------------------------- CUPONS - Cupons disponiveis registrados.
CREATE TABLE cupons (
    id_cupom INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_usuario INTEGER,
    descricao VARCHAR(255) NOT NULL,
    data_resgate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES pessoas(id_pessoa)
);

-- ---------------------------------------------------------------------- REAÇÕES DE FEED - Tabela de Curtidas e Descurtidas (Like e Dislike)
CREATE TABLE reacoes_feed (
    id_reacao INT AUTO_INCREMENT PRIMARY KEY,
    id_feed INT,
    id_usuario INT,
    tipo ENUM('Like', 'Dislike') NOT NULL,
    CONSTRAINT unica_reacao UNIQUE (id_feed, id_usuario),
    data_reacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_feed) REFERENCES feed_usuario(id_feed),
    FOREIGN KEY (id_usuario) REFERENCES pessoas(id_pessoa)
);

-- ---------------------------------------------------------------------- FEED DO USUARIO - VIEW para que o usuário só veja seu próprio feed
CREATE VIEW meu_feed AS
SELECT * FROM feed_usuario
WHERE id_usuario = @id_usuario_logado;

-- ---------------------------------------------------------------------- FEED DO SUB-ADMIN - Tabela com histórico de metas dos usuários, Publicações e Cupons (Visão para Sub-Admin).
CREATE VIEW dashboard_subadmin AS
SELECT 
    pessoas.nome AS nome_usuario,
    metas.descricao AS descricao_meta,
    metas.pontos AS pontos_conquistados,
    cupons.descricao AS descricao_cupom,
    feed_usuario.tempo_corrida,
    feed_usuario.calorias_perdidas,
    feed_usuario.km_percorridos,
    feed_usuario.foto_corrida,
    feed_usuario.data_publicacao,
    COUNT(reacoes_feed.id_reacao) AS total_reacoes
FROM pessoas
LEFT JOIN pontos_usuarios ON pessoas.id_pessoa = pontos_usuarios.id_usuario
LEFT JOIN metas ON pontos_usuarios.id_meta = metas.id_meta
LEFT JOIN cupons ON pessoas.id_pessoa = cupons.id_usuario
LEFT JOIN feed_usuario ON pessoas.id_pessoa = feed_usuario.id_usuario
LEFT JOIN reacoes_feed ON feed_usuario.id_feed = reacoes_feed.id_feed
GROUP BY feed_usuario.id_feed;