<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $nome      = $_POST['nome_quadra'];
    $endereco  = $_POST['endereco'];
    $tipo      = $_POST['tipo_quadra'];
    $latitude  = empty($_POST['latitude']) ? null : $_POST['latitude'];
    $longitude = empty($_POST['longitude']) ? null : $_POST['longitude'];

    $conexao->begin_transaction();

    $stmt = $conexao->prepare('UPDATE quadra SET nome_quadra = ?, endereco = ?, tipo_quadra = ?, latitude = ?, longitude = ? WHERE id_quadra = ?');
    $stmt->bind_param('sssddi', $nome, $endereco, $tipo, $latitude, $longitude, $_GET['id']);

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
