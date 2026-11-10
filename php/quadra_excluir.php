<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $conexao->begin_transaction();

    // A chave estrangeira impede excluir quadra com partida ligada
    $stmt = $conexao->prepare('DELETE FROM quadra WHERE id_quadra = ?');
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro excluído.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Registro não excluído. A quadra pode ter partidas ligadas a ela.';
    }
    $stmt->close();
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'É necessário informar um ID para exclusão.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
