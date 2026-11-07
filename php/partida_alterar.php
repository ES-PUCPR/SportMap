<?php
include_once('conexao.php');
include_once('partida_organizador.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

if (!isset($_GET['id'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID não informado.';
} else if (!ehOrganizador($conexao, (int) $_GET['id'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Apenas o organizador pode alterar a partida.';
} else {
    $id            = (int) $_GET['id'];
    $id_quadra     = (int) $_POST['id_quadra'];
    $id_modalidade = (int) $_POST['id_modalidade'];
    $inicio        = $_POST['horario_inicio'];
    $fim           = $_POST['horario_fim'];
    $max           = (int) $_POST['max_jogadores'];
    $descricao     = $_POST['descricao'];
    $tipo_acesso   = $_POST['tipo_acesso'];
    $data_hora     = $_POST['data'] . ' ' . $inicio;

    $conexao->begin_transaction();

    $stmt = $conexao->prepare('UPDATE partida SET id_modalidade = ?, data_hora = ?, max_jogadores = ?, descricao = ?, tipo_acesso = ? WHERE id_partida = ?');
    $stmt->bind_param('isissi', $id_modalidade, $data_hora, $max, $descricao, $tipo_acesso, $id);
    $ok1 = $stmt->execute();
    $stmt->close();

    $stmt = $conexao->prepare('UPDATE partida_quadra SET id_quadra = ?, horario_inicio = ?, horario_fim = ? WHERE id_partida = ?');
    $stmt->bind_param('issi', $id_quadra, $inicio, $fim, $id);
    $ok2 = $stmt->execute();
    $stmt->close();

    if ($ok1 && $ok2) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro alterado com sucesso.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Não foi possível alterar o registro.';
    }
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
