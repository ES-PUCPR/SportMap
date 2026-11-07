
USE sportmap;


-- 1) PERFIS DE ACESSO (3 perfis fixos)

ALTER TABLE perfil_acesso
    ADD UNIQUE KEY uq_perfil_tipo (tipo_perfil);

INSERT INTO perfil_acesso (tipo_perfil) VALUES
    ('usuario'),        -- usuário comum: entra e cria partidas
    ('dono_quadra'),    -- dono de quadra: cadastra quadras
    ('superadmin')      -- faz tudo e valida quadras
ON DUPLICATE KEY UPDATE tipo_perfil = VALUES(tipo_perfil);

-- 2) USUÁRIO / LOGIN / JOGADOR

ALTER TABLE usuario
    ADD COLUMN ativo TINYINT(1) NOT NULL DEFAULT 1;

-- cada usuário tem no máximo 1 login e 1 registro de jogador
ALTER TABLE login
    ADD UNIQUE KEY uq_login_usuario (id_usuario);

ALTER TABLE jogador
    ADD UNIQUE KEY uq_jogador_usuario (id_usuario);

-- 3) MODALIDADE

ALTER TABLE modalidade
    ADD UNIQUE KEY uq_modalidade_nome (nome);

INSERT INTO modalidade (nome, qnt_jogadores) VALUES
    ('Campo',   22),   -- 11 x 11
    ('Society', 14),   --  7 x 7
    ('Futsal',  10)    --  5 x 5
ON DUPLICATE KEY UPDATE qnt_jogadores = VALUES(qnt_jogadores);

-- 4) QUADRA (localização + validação pelo superadmin)

ALTER TABLE quadra
    ADD COLUMN latitude          DECIMAL(10,7) NULL,
    ADD COLUMN longitude         DECIMAL(10,7) NULL,
    ADD COLUMN status_validacao  ENUM('pendente','aprovada','reprovada') NOT NULL DEFAULT 'pendente',
    ADD COLUMN motivo_reprovacao VARCHAR(255) NULL,
    ADD COLUMN id_validador      INT NULL,
    ADD COLUMN data_validacao    DATETIME NULL,
    ADD CONSTRAINT fk_quadra_validador FOREIGN KEY (id_validador) REFERENCES usuario(id_usuario),
    ADD INDEX idx_quadra_status (status_validacao),
    ADD INDEX idx_quadra_coord (latitude, longitude);

CREATE TABLE IF NOT EXISTS quadra_modalidade (
    id_quadra     INT NOT NULL,
    id_modalidade INT NOT NULL,
    PRIMARY KEY (id_quadra, id_modalidade),
    FOREIGN KEY (id_quadra)     REFERENCES quadra(id_quadra) ON DELETE CASCADE,
    FOREIGN KEY (id_modalidade) REFERENCES modalidade(id_modalidade)
) ENGINE=InnoDB;

-- 5) PARTIDA (organizador, tipo de acesso, vagas)

ALTER TABLE partida
    ADD COLUMN id_organizador INT NULL,
    ADD COLUMN tipo_acesso    ENUM('publica','privada_visivel','privada_convite') NOT NULL DEFAULT 'publica',
    ADD COLUMN max_jogadores  INT NOT NULL DEFAULT 10,
    ADD COLUMN descricao      VARCHAR(255) NULL,
    MODIFY COLUMN status_partida VARCHAR(20) NOT NULL DEFAULT 'aberta',  -- aberta | completa | cancelada | encerrada
    ADD CONSTRAINT fk_partida_organizador FOREIGN KEY (id_organizador) REFERENCES usuario(id_usuario),
    ADD INDEX idx_partida_data (data_hora);

-- 6) ESCALAÇÃO (quem está na partida e em que situação)

ALTER TABLE escalacao
    ADD COLUMN status_participacao ENUM('confirmado','pendente','convidado','recusado') NOT NULL DEFAULT 'confirmado',
    ADD COLUMN posicao      VARCHAR(30) NULL,
    ADD COLUMN data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;


-- 7) TIMES (CRUD de times)

ALTER TABLE time_futebol
    ADD COLUMN id_criador INT NULL,
    ADD COLUMN cidade     VARCHAR(100) NULL,
    ADD COLUMN descricao  VARCHAR(255) NULL,
    ADD CONSTRAINT fk_time_criador FOREIGN KEY (id_criador) REFERENCES usuario(id_usuario);


-- 8) SUPERADMIN INICIAL (só ele é criado por SQL; no cadastro do site ninguém vira superadmin)
--    e-mail: admin@sportmap.com   senha: Admin@123

INSERT INTO usuario (nome, cpf, email) VALUES ('Super Admin', '52998224725', 'admin@sportmap.com');

INSERT INTO login (id_usuario, senha)
SELECT id_usuario, '$2b$12$G6cPWHzPiauqxwFzTIeCSO67anf4fXJV.EBXnJcVfiVqa/ZwYch9m'
FROM usuario WHERE email = 'admin@sportmap.com';

INSERT INTO usuario_perfil (id_usuario, id_perfil)
SELECT u.id_usuario, p.id_perfil
FROM usuario u
JOIN perfil_acesso p ON p.tipo_perfil = 'superadmin'
WHERE u.email = 'admin@sportmap.com';
