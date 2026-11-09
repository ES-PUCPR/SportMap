<?php
include_once('conexao.php');
include_once('partida_organizador.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_partida = (int) $_POST['id_partida'];
$email = $_POST['email'];

if(!ehOrganizador($conexao, $id_partida)){
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Apenas o organizador pode convidar jogadores.';
}else{
    $stmt = $conexao->prepare('SELECT id_usuario FROM usuario WHERE email = ? AND ativo = 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $convidado = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if(!$convidado){
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Usuário não encontrado.';
    }else{
        $conexao->begin_transaction();

        // Cria o jogador se ele não existir
        $stmt = $conexao->prepare('INSERT IGNORE INTO jogador (id_usuario) VALUES (?)');
        $stmt->bind_param('i', $convidado['id_usuario']);
        $stmt->execute();
        $stmt->close();

        $stmt = $conexao->prepare("INSERT INTO escalacao (id_jogador, id_partida, status_participacao) SELECT id_jogador, ?, 'convidado' FROM jogador WHERE id_usuario = ?");
        $stmt->bind_param('ii', $id_partida, $convidado['id_usuario']);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $conexao->commit();
            $retorno['status'] = 'ok';
            $retorno['mensagem'] = 'Convite enviado.';
        }else{
            $conexao->rollback();
            $retorno['status'] = 'nok';
            $retorno['mensagem'] = 'Este usuário já está nesta partida.';
        }
        $stmt->close();
    }
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
