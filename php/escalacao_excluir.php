<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_usuario = $_SESSION['usuario'][0]['id_usuario'];

$conexao->begin_transaction();

$stmt = $conexao->prepare('DELETE e FROM escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador WHERE e.id_partida = ? AND j.id_usuario = ? AND e.status_participacao <> \'recusado\'');
$stmt->bind_param('ii', $_GET['id_partida'], $id_usuario);
$stmt->execute();

if($stmt->affected_rows > 0){
    $conexao->commit();
    $retorno['status'] = 'ok';
    $retorno['mensagem'] = 'Registro excluído.';
}else{
    $conexao->rollback();
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'Registro não excluído.';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
