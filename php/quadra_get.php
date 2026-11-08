<?php
include_once('conexao.php');
session_start(); // Inicia a sessão para capturar os dados do usuário logado
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$logado = $_SESSION['usuario'][0];

// Determina qual consulta (SELECT) será feita com base nos parâmetros ou no perfil do usuário
if (isset($_GET['id'])) {
    // Busca uma quadra específica pelo ID
    $stmt = $conexao->prepare('SELECT * FROM quadra WHERE id_quadra = ?');
    $stmt->bind_param('i', $_GET['id']);
} else if (isset($_GET['aprovadas'])) {
    // Busca apenas as quadras que já foram validadas e aprovadas
    $stmt = $conexao->prepare("SELECT * FROM quadra WHERE status_validacao = 'aprovada'");
} else if ($logado['admin'] == 1) {
    // Se for administrador, busca todas as quadras do sistema
    $stmt = $conexao->prepare('SELECT * FROM quadra');
} else {
    // Se for um usuário comum, busca apenas as quadras cadastradas por ele
    $stmt = $conexao->prepare('SELECT * FROM quadra WHERE id_usuario = ?');
    $stmt->bind_param('i', $logado['id_usuario']);
}

$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
// Transforma o resultado do banco em um array associativo
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