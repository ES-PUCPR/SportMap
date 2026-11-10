<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$sql = 'SELECT u.id_usuario, u.nome, u.cpf, u.email, u.telefone, u.ativo, j.posicao
        FROM usuario u
        LEFT JOIN jogador j ON j.id_usuario = u.id_usuario';

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare($sql . ' WHERE u.id_usuario = ?');
    $stmt->bind_param('i', $_GET['id']);
} else {
    $stmt = $conexao->prepare($sql);
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
