<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $nome      = $_POST['nome'];
    $sigla     = $_POST['sigla'];
    $cidade    = $_POST['cidade'];
    $descricao = $_POST['descricao'];

    $conexao->begin_transaction();

    $stmt = $conexao->prepare('UPDATE time_futebol SET nome = ?, sigla = ?, cidade = ?, descricao = ? WHERE id_time = ?');
    $stmt->bind_param('ssssi', $nome, $sigla, $cidade, $descricao, $_GET['id']);

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
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID não informado.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
