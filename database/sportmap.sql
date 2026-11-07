-- SportMap - criação do banco de dados
-- Baseado no modelo lógico (inicialmente 13 tabelas)

CREATE DATABASE IF NOT EXISTS sportmap
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sportmap;

CREATE TABLE perfil_acesso (
    id_perfil   INT AUTO_INCREMENT PRIMARY KEY,
    tipo_perfil VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE usuario (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    cpf             CHAR(11)     NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    telefone        VARCHAR(20),
    data_nascimento DATE
) ENGINE=InnoDB;

CREATE TABLE modalidade (
    id_modalidade INT AUTO_INCREMENT PRIMARY KEY,
    nome          VARCHAR(50) NOT NULL,
    qnt_jogadores INT         NOT NULL
) ENGINE=InnoDB;

CREATE TABLE time_futebol (
    id_time INT AUTO_INCREMENT PRIMARY KEY,
    nome    VARCHAR(100) NOT NULL,
    sigla   VARCHAR(10)
) ENGINE=InnoDB;

CREATE TABLE login (
    id_login     INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario   INT          NOT NULL,
    senha        VARCHAR(255) NOT NULL,  -- guarda o HASH da senha
    data_criacao DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE usuario_perfil (
    id_usuario INT NOT NULL,
    id_perfil  INT NOT NULL,
    PRIMARY KEY (id_usuario, id_perfil),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_perfil)  REFERENCES perfil_acesso(id_perfil)
) ENGINE=InnoDB;

CREATE TABLE quadra (
    id_quadra   INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario  INT          NOT NULL,
    nome_quadra VARCHAR(100) NOT NULL,
    endereco    VARCHAR(200) NOT NULL,
    tipo_quadra VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE jogador (
    id_jogador INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    posicao    VARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE partida (
    id_partida     INT AUTO_INCREMENT PRIMARY KEY,
    id_modalidade  INT         NOT NULL,
    data_hora      DATETIME    NOT NULL,
    status_partida VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_modalidade) REFERENCES modalidade(id_modalidade)
) ENGINE=InnoDB;

CREATE TABLE partida_quadra (
    id_partida     INT NOT NULL,
    id_quadra      INT NOT NULL,
    horario_inicio TIME,
    horario_fim    TIME,
    PRIMARY KEY (id_partida, id_quadra),
    FOREIGN KEY (id_partida) REFERENCES partida(id_partida),
    FOREIGN KEY (id_quadra)  REFERENCES quadra(id_quadra)
) ENGINE=InnoDB;

CREATE TABLE jogador_time (
    id_jogador   INT NOT NULL,
    id_time      INT NOT NULL,
    data_entrada DATE,
    PRIMARY KEY (id_jogador, id_time),
    FOREIGN KEY (id_jogador) REFERENCES jogador(id_jogador),
    FOREIGN KEY (id_time)    REFERENCES time_futebol(id_time)
) ENGINE=InnoDB;

CREATE TABLE escalacao (
    id_jogador INT NOT NULL,
    id_partida INT NOT NULL,
    PRIMARY KEY (id_jogador, id_partida),
    FOREIGN KEY (id_jogador) REFERENCES jogador(id_jogador),
    FOREIGN KEY (id_partida) REFERENCES partida(id_partida)
) ENGINE=InnoDB;

CREATE TABLE estatisticas_partida (
    id_estatisticas INT AUTO_INCREMENT PRIMARY KEY,
    id_jogador      INT NOT NULL,
    id_partida      INT NOT NULL,
    time_vencedor   VARCHAR(100),
    placar          VARCHAR(10),
    FOREIGN KEY (id_jogador) REFERENCES jogador(id_jogador),
    FOREIGN KEY (id_partida) REFERENCES partida(id_partida)
) ENGINE=InnoDB;
