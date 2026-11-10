<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$id_quadra     = (int) $_POST['id_quadra'];
$id_modalidade = (int) $_POST['id_modalidade'];
$data          = $_POST['data'];
$inicio        = $_POST['horario_inicio'];
$fim           = $_POST['horario_fim'];
$max           = (int) $_POST['max_jogadores'];
$descricao     = $_POST['descricao'];
$tipo_acesso   = $_POST['tipo_acesso'];
$data_hora     = $data . ' ' . $inicio;
$organizador   = $_SESSION['usuario'][0]['id_usuario'];

if (empty($id_quadra) || empty($id_modalidade) || empty($data) || empty($inicio) || empty($fim) || empty($max) || empty($tipo_acesso)) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Preencha todos os campos.';
} else {
    $conexao->begin_transaction();

    // FOR UPDATE impede que duas pessoas marquem o mesmo horário na quadra
    $stmt = $conexao->prepare(
        "SELECT p.id_partida FROM partida p
         JOIN partida_quadra pq ON pq.id_partida = p.id_partida
         WHERE pq.id_quadra = ? AND DATE(p.data_hora) = ? AND p.status_partida <> 'cancelada'
           AND pq.horario_inicio < ? AND pq.horario_fim > ?
         FOR UPDATE"
    );
    $stmt->bind_param('isss', $id_quadra, $data, $fim, $inicio);
    $stmt->execute();
    $ocupada = $stmt->get_result()->num_rows > 0;
    $stmt->close();

    if ($ocupada) {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Esta quadra já tem uma partida nesse horário.';
    } else {
        $stmt = $conexao->prepare('INSERT INTO partida (id_modalidade, data_hora, id_organizador, max_jogadores, descricao, tipo_acesso) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('isiiss', $id_modalidade, $data_hora, $organizador, $max, $descricao, $tipo_acesso);
        $stmt->execute();
        $id_partida = $stmt->insert_id;
        $stmt->close();

        $stmt = $conexao->prepare('INSERT INTO partida_quadra (id_partida, id_quadra, horario_inicio, horario_fim) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('iiss', $id_partida, $id_quadra, $inicio, $fim);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $conexao->commit();
            $retorno['status']   = 'ok';
            $retorno['mensagem'] = 'Registro inserido com sucesso.';
            $retorno['data']     = ['id_partida' => $id_partida];
        } else {
            $conexao->rollback();
            $retorno['status']   = 'nok';
            $retorno['mensagem'] = 'Falha ao inserir o registro.';
        }
        $stmt->close();
    }
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
