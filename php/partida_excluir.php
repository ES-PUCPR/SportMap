<?php
include_once('conexao.php');
include_once('partida_organizador.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (!isset($_GET['id'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'É necessário informar um ID para exclusão.';
} else if (!ehOrganizador($conexao, (int) $_GET['id'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Apenas o organizador pode cancelar a partida.';
} else {
    $conexao->begin_transaction();

    $stmt = $conexao->prepare("UPDATE partida SET status_partida = 'cancelada' WHERE id_partida = ?");
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro excluído.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Registro não excluído.';
    }
    $stmt->close();
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
