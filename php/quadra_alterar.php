<?php
include_once('conexao.php'); // Importa a conexão com o banco
$retorno = ['status' => '', 'mensagem' => '', 'data' => []]; // Estrutura padrão de resposta JSON

// Verifica se o ID foi informado via GET na URL
if (isset($_GET['id'])) {
    // Recebe os dados do formulário via POST
    $nome      = $_POST['nome_quadra'];
    $endereco  = $_POST['endereco'];
    $tipo      = $_POST['tipo_quadra'];
    // Se a latitude/longitude vier vazia, salva como null
    $latitude  = empty($_POST['latitude']) ? null : $_POST['latitude'];
    $longitude = empty($_POST['longitude']) ? null : $_POST['longitude'];

    // Inicia a transação para garantir integridade dos dados
    $conexao->begin_transaction();

    // Prepara a query de atualização (UPDATE) protegendo contra SQL Injection
    $stmt = $conexao->prepare('UPDATE quadra SET nome_quadra = ?, endereco = ?, tipo_quadra = ?, latitude = ?, longitude = ? WHERE id_quadra = ?');
    $stmt->bind_param('sssddi', $nome, $endereco, $tipo, $latitude, $longitude, $_GET['id']);

    // Executa e valida a alteração
    if ($stmt->execute()) {
        $conexao->commit(); // Confirma a alteração no banco
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro alterado com sucesso.';
    } else {
        $conexao->rollback(); // Desfaz a operação em caso de erro
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Não foi possível alterar o registro.';
    }
    $stmt->close();
} else {
    // Retorna erro se o ID não foi passado
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID não informado.';
}

$conexao->close(); // Encerra a conexão

// Define o cabeçalho como JSON e imprime a resposta
header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);