<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Recebe os dados via POST
$nome      = $_POST['nome_quadra'];
$endereco  = $_POST['endereco'];
$tipo      = $_POST['tipo_quadra'];
$latitude  = empty($_POST['latitude']) ? null : $_POST['latitude'];
$longitude = empty($_POST['longitude']) ? null : $_POST['longitude'];
$dono      = $_SESSION['usuario'][0]['id_usuario']; // Pega o ID de quem está logado criando a quadra

// Validação básica de campos obrigatórios
if (empty($nome) || empty($endereco)) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Preencha nome e endereço.';
} else {
    $conexao->begin_transaction();

    // Insere a nova quadra no banco vinculando ao usuário logado
    $stmt = $conexao->prepare('INSERT INTO quadra (id_usuario, nome_quadra, endereco, tipo_quadra, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('isssdd', $dono, $nome, $endereco, $tipo, $latitude, $longitude);
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