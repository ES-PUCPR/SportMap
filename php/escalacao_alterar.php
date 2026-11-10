<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_usuario = $_SESSION['usuario'][0]['id_usuario'];

$conexao->begin_transaction();

$stmt = $conexao->prepare('UPDATE escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador SET e.posicao = ? WHERE e.id_partida = ? AND j.id_usuario = ?');
$stmt->bind_param('sii', $_POST['posicao'], $_POST['id_partida'], $id_usuario);

if ($stmt->execute()) {
    $conexao->commit();
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Registro alterado com sucesso.';
} else {
    $conexao->rollback();
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Não foi possível alterar o registro.';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
