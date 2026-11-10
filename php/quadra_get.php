<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$logado = $_SESSION['usuario'][0];

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare('SELECT * FROM quadra WHERE id_quadra = ?');
    $stmt->bind_param('i', $_GET['id']);
} else if (isset($_GET['aprovadas'])) {
    $stmt = $conexao->prepare("SELECT * FROM quadra WHERE status_validacao = 'aprovada'");
} else if ($logado['admin'] == 1) {
    $stmt = $conexao->prepare('SELECT * FROM quadra');
} else {
    $stmt = $conexao->prepare('SELECT * FROM quadra WHERE id_usuario = ?');
    $stmt->bind_param('i', $logado['id_usuario']);
}

$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
if ($resultado->num_rows > 0) {
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = $linha;
    }
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Consulta efetuada.';
    $retorno['data']     = $tabela;
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Não há registros.';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
