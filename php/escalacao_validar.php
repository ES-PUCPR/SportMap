<?php
include_once('conexao.php');
include_once('partida_organizador.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_partida = (int) $_POST['id_partida'];
$id_jogador = (int) $_POST['id_jogador'];
$status = $_POST['status'];

if(!ehOrganizador($conexao, $id_partida)){
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Apenas o organizador pode aprovar pedidos.';
}else if($status != 'confirmado' && $status != 'recusado') {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Não foi possível alterar o registro.';
}else{
    $conexao->begin_transaction();

    // FOR UPDATE: duas aprovações ao mesmo tempo não conseguem usar a mesma última vaga
    $stmt = $conexao->prepare(
        "SELECT p.status_partida, p.max_jogadores,
                (SELECT COUNT(*) FROM escalacao e WHERE e.id_partida = p.id_partida AND e.status_participacao = 'confirmado') AS confirmados
         FROM partida p WHERE p.id_partida = ? FOR UPDATE"
    );
    $stmt->bind_param('i', $id_partida);
    $stmt->execute();
    $partida = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if($partida['status_partida'] == 'cancelada'){
        $conexao->rollback();
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Esta partida foi cancelada.';
    }else if($status == 'confirmado' && $partida['confirmados'] >= $partida['max_jogadores']){
        $conexao->rollback();
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Não há vagas disponíveis nesta partida.';
    }else{
        $stmt = $conexao->prepare("UPDATE escalacao SET status_participacao = ? WHERE id_partida = ? AND id_jogador = ? AND status_participacao = 'pendente'");
        $stmt->bind_param('sii', $status, $id_partida, $id_jogador);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $conexao->commit();
            $retorno['status'] = 'ok';
            $retorno['mensagem'] = 'Registro alterado com sucesso.';
        }else{
            $conexao->rollback();
            $retorno['status'] = 'nok';
            $retorno['mensagem'] = 'Não foi possível alterar o registro.';
        }
        $stmt->close();
    }
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
