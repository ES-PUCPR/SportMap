<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (isset($_GET['id'])) {
    $id       = (int) $_GET['id'];
    $nome     = $_POST['nome'];
    $email    = $_POST['email'];
    $telefone = $_POST['telefone'];
    $posicao  = $_POST['posicao'];

    $conexao->begin_transaction();

    $stmt = $conexao->prepare('UPDATE usuario SET nome = ?, email = ?, telefone = ? WHERE id_usuario = ?');
    $stmt->bind_param('sssi', $nome, $email, $telefone, $id);
    $ok = $stmt->execute();
    $stmt->close();

    // Cria o jogador se ele não existir (o admin inicial não tem)
    $stmt = $conexao->prepare('INSERT INTO jogador (id_usuario, posicao) VALUES (?, ?) ON DUPLICATE KEY UPDATE posicao = ?');
    $stmt->bind_param('iss', $id, $posicao, $posicao);
    $stmt->execute();
    $stmt->close();

    if (!empty($_POST['senha'])) {
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
        $stmt = $conexao->prepare('UPDATE login SET senha = ? WHERE id_usuario = ?');
        $stmt->bind_param('si', $senha, $id);
        $stmt->execute();
        $stmt->close();
    }

    if ($ok) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro alterado com sucesso.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Não foi possível alterar o registro.';
    }
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID não informado.';
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
