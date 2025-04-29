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
    foto_url VARCHAR(255) DEFAULT NULL,
    senha VARCHAR(100) NOT NULL,
    pontos INTEGER DEFAULT 0,
    km_percorridos INTEGER DEFAULT 0,
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
    titulo VARCHAR(100),
    descricao TEXT,
    km_percorridos DECIMAL(5,2) NOT NULL,
    tempo_corrida TIME NOT NULL,
    local VARCHAR(100),
    chegada VARCHAR(100),
    id_pessoa INTEGER,
    foto_corrida VARCHAR(255),
    foto_smartwatch VARCHAR(255),
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER,
	dislikes INTEGER,
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
    link VARCHAR(255),
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