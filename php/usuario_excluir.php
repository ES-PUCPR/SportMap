<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $conexao->begin_transaction();

    // Exclusão lógica: a conta só é desativada
    $stmt = $conexao->prepare('UPDATE usuario SET ativo = 0 WHERE id_usuario = ?');
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
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'É necessário informar um ID para exclusão.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
