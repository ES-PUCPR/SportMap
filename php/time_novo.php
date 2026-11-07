<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$nome      = $_POST['nome'];
$sigla     = $_POST['sigla'];
$cidade    = $_POST['cidade'];
$descricao = $_POST['descricao'];
$criador   = $_SESSION['usuario'][0]['id_usuario'];

if (empty($nome)) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Preencha o nome do time.';
} else {
    $conexao->begin_transaction();

    $stmt = $conexao->prepare('INSERT INTO time_futebol (nome, sigla, id_criador, cidade, descricao) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('ssiss', $nome, $sigla, $criador, $cidade, $descricao);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro inserido com sucesso.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Falha ao inserir o registro.';
    }
    $stmt->close();
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
