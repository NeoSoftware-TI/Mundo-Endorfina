create database Corrida;

use Corrida;

-- ---------------------------------------------------------------------- ADMIN - Onde todos irão estar registrados.
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL
);

-- ---------------------------------------------------------------------- SUB-ADMIN - Onde todos irão estar registrados.
CREATE TABLE IF NOT EXISTS subadmin (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL
);