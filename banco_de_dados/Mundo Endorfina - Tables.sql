-- ---------------------------------------------------------------------- LOGIN - Listar todas as entradas.
CREATE TABLE login (
    id_login INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INTEGER,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('Visitante','Cliente', 'Sub-Admin', 'Admin') NOT NULL
);

-- ---------------------------------------------------------------------- PESSOAS - Todos os indivíduos cadastrados.
CREATE TABLE pessoas (
    id_pessoa INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    senha VARCHAR(100) NOT NULL,
    pontos INTEGER DEFAULT 0,
    km_percorridos DECIMAL(5,2) DEFAULT 0,
    FOREIGN KEY (id_login) REFERENCES login(id_login) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------- ADMIN - Onde todos Admin irão estar registrados.
CREATE TABLE admin (
    id_admin INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    id_pessoa INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- SUB-ADMIN - Onde todos Sub-Admin irão estar registrados.
CREATE TABLE sub_admin (
    id_subadmin INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    id_pessoa INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- CLIENTES - Onde todos Cliente irão estar registrados.
CREATE TABLE cliente (
    id_cliente INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_login INTEGER,
    id_pessoa INTEGER,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- INFORMAÇÕES DE POST - Aqui armazena as informações de Tempo de Corrida, KM e Foto da Corrida.
CREATE TABLE post (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INTEGER,
    tempo_corrida TIME NOT NULL,
    km_percorridos DECIMAL(5,2) NOT NULL,
    foto_corrida VARCHAR(255),
    local VARCHAR(100),
    chegada VARCHAR(100),
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    likes INTEGER,
    titulo VARCHAR(100),
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa) ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------- CUPONS - Cupons disponiveis registrados.
CREATE TABLE cupons (
    id_cupom INTEGER AUTO_INCREMENT PRIMARY KEY,
    id_pessoa INTEGER,
    titulo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    pontos INTEGER DEFAULT 0,
    validade VARCHAR(255) NOT NULL,
    resgates INTEGER DEFAULT 0,
    data_resgate DATETIME DEFAULT CURRENT_TIMESTAMP,
    disponivel VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_pessoa) REFERENCES pessoas(id_pessoa)
);
-- ---------------------------------------------------------------------- EXCLUIDOS - Registro pessoas Standbay.
CREATE TABLE excluidos (
  id_exclusao INTEGER AUTO_INCREMENT PRIMARY KEY,
  id_login INTEGER,
  id_cliente INTEGER,
  id_pessoa INTEGER,
  nome VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(15),
  senha VARCHAR(255),
  tipo ENUM('Visitante', 'Cliente', 'Sub-Admin', 'Admin'),
  data_exclusao DATETIME DEFAULT CURRENT_TIMESTAMP
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