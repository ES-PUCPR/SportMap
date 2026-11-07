<?php
// Confere se o usuário logado é o organizador da partida ou o administrador
function ehOrganizador($conexao, $id_partida) {
    if (!isset($_SESSION['usuario'])) {
        return false;
    }
    $logado = $_SESSION['usuario'][0];

    $stmt = $conexao->prepare('SELECT id_organizador FROM partida WHERE id_partida = ?');
    $stmt->bind_param('i', $id_partida);
    $stmt->execute();
    $partida = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $partida && ($logado['admin'] == 1 || $partida['id_organizador'] == $logado['id_usuario']);
}
