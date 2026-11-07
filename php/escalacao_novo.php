<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_partida = (int) $_POST['id_partida'];
$posicao    = $_POST['posicao'];
$logado     = $_SESSION['usuario'][0];
$id_usuario = $logado['id_usuario'];

$conexao->begin_transaction();

// FOR UPDATE: duas pessoas não conseguem pegar a mesma última vaga. A segunda espera o COMMIT.
$stmt = $conexao->prepare(
    "SELECT p.status_partida, p.max_jogadores, p.tipo_acesso, p.id_organizador,
            (SELECT COUNT(*) FROM escalacao e WHERE e.id_partida = p.id_partida AND e.status_participacao = 'confirmado') AS confirmados,
            (SELECT e.status_participacao FROM escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador
             WHERE e.id_partida = p.id_partida AND j.id_usuario = ?) AS situacao
     FROM partida p WHERE p.id_partida = ? FOR UPDATE"
);
$stmt->bind_param('ii', $id_usuario, $id_partida);
$stmt->execute();
$partida = $stmt->get_result()->fetch_assoc();
$stmt->close();

$organizador = $logado['admin'] == 1 || $partida['id_organizador'] == $id_usuario;
$situacao    = $partida['situacao'];
$erro        = '';

if ($partida['status_partida'] == 'cancelada') {
    $erro = 'Esta partida foi cancelada.';
} else if ($situacao == 'confirmado') {
    $erro = 'Você já está nesta partida.';
} else if ($situacao == 'pendente') {
    $erro = 'Seu pedido já foi enviado ao organizador.';
} else if ($situacao == 'recusado') {
    $erro = 'Seu pedido foi recusado pelo organizador.';
} else if ($situacao == null && $partida['tipo_acesso'] == 'privada_convite' && !$organizador) {
    $erro = 'Esta partida é somente para convidados.';
} else if ($partida['confirmados'] >= $partida['max_jogadores']) {
    $erro = 'Não há vagas disponíveis nesta partida.';
}

if ($erro != '') {
    $conexao->rollback();
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = $erro;
} else {
    if ($situacao == 'convidado') {
        $status = 'confirmado';
        $stmt = $conexao->prepare("UPDATE escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador SET e.status_participacao = 'confirmado', e.posicao = ? WHERE e.id_partida = ? AND j.id_usuario = ?");
        $stmt->bind_param('sii', $posicao, $id_partida, $id_usuario);
    } else {
        // Na privada visível, a entrada depende da aprovação do organizador
        $status = ($partida['tipo_acesso'] == 'privada_visivel' && !$organizador) ? 'pendente' : 'confirmado';

        // Cria o jogador se ele não existir (o admin inicial não tem)
        $stmt = $conexao->prepare('INSERT IGNORE INTO jogador (id_usuario) VALUES (?)');
        $stmt->bind_param('i', $id_usuario);
        $stmt->execute();
        $stmt->close();

        $stmt = $conexao->prepare('INSERT INTO escalacao (id_jogador, id_partida, posicao, status_participacao) SELECT id_jogador, ?, ?, ? FROM jogador WHERE id_usuario = ?');
        $stmt->bind_param('issi', $id_partida, $posicao, $status, $id_usuario);
    }
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = $status == 'pendente' ? 'Pedido enviado ao organizador.' : 'Registro inserido com sucesso.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Você já está nesta partida.';
    }
    $stmt->close();
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
