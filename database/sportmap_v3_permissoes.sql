-- Usuário do banco usado pelo site, com apenas as permissões que o código precisa.
-- Execute depois de sportmap.sql e sportmap_v2.sql. A senha é só para uso local.

CREATE USER IF NOT EXISTS 'sportmap_app'@'localhost' IDENTIFIED BY 'pucpr2026';
ALTER USER 'sportmap_app'@'localhost' IDENTIFIED BY 'pucpr2026';

GRANT SELECT ON sportmap.modalidade TO 'sportmap_app'@'localhost';
GRANT SELECT ON sportmap.perfil_acesso TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT ON sportmap.usuario_perfil TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON sportmap.usuario TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON sportmap.login TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON sportmap.jogador TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON sportmap.partida TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON sportmap.partida_quadra TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON sportmap.quadra TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON sportmap.escalacao TO 'sportmap_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON sportmap.time_futebol TO 'sportmap_app'@'localhost';
GRANT SELECT, DELETE ON sportmap.jogador_time TO 'sportmap_app'@'localhost';

SHOW GRANTS FOR 'sportmap_app'@'localhost';
