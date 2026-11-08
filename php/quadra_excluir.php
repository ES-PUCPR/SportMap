<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Verifica se o ID da quadra foi informado
if (isset($_GET['id'])) {
    $conexao->begin_transaction();

    // Prepara a exclusão
    // Uma quadra com partida ligada não pode ser removida: a chave estrangeira impede o DELETE
    $stmt = $conexao->prepare('DELETE FROM quadra WHERE id_quadra = ?');
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();

    // Verifica se alguma linha foi de fato apagada
    if ($stmt->affected_rows > 0) {
        $conexao->commit(); // Confirma a exclusão
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro excluído.';
    } else {
        $conexao->rollback(); // Reverte a operação se falhou (ex: restrição de chave estrangeira)
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