<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$logado = $_SESSION['usuario'][0];

if ($logado['admin'] != 1) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Apenas o administrador pode validar quadras.';
} else {
    $conexao->begin_transaction();

    $stmt = $conexao->prepare('UPDATE quadra SET status_validacao = ?, id_validador = ?, data_validacao = NOW() WHERE id_quadra = ?');
    $stmt->bind_param('sii', $_POST['status'], $logado['id_usuario'], $_POST['id_quadra']);

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
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
