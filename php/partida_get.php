<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$logado = $_SESSION['usuario'][0] ?? ['id_usuario' => 0, 'admin' => 0];
$eu     = $logado['id_usuario'];
$admin  = (int) $logado['admin'];

$sql = "SELECT p.*, m.nome AS modalidade, q.id_quadra, q.nome_quadra, q.endereco,
               pq.horario_inicio, pq.horario_fim, u.nome AS organizador,
               (SELECT COUNT(*) FROM escalacao e WHERE e.id_partida = p.id_partida AND e.status_participacao = 'confirmado') AS confirmados,
               (SELECT e.status_participacao FROM escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador
                WHERE e.id_partida = p.id_partida AND j.id_usuario = ?) AS minha_situacao
        FROM partida p
        JOIN modalidade m ON m.id_modalidade = p.id_modalidade
        JOIN partida_quadra pq ON pq.id_partida = p.id_partida
        JOIN quadra q ON q.id_quadra = pq.id_quadra
        LEFT JOIN usuario u ON u.id_usuario = p.id_organizador";

// Partida por convite só aparece para organizador, admin e convidados
$acesso = "(p.tipo_acesso <> 'privada_convite' OR p.id_organizador = ? OR ? = 1
            OR EXISTS (SELECT 1 FROM escalacao e JOIN jogador j ON j.id_jogador = e.id_jogador
                       WHERE e.id_partida = p.id_partida AND j.id_usuario = ?))";

if (isset($_GET['id'])) {
    $stmt = $conexao->prepare($sql . " WHERE $acesso AND p.id_partida = ?");
    $stmt->bind_param('iiiii', $eu, $eu, $admin, $eu, $_GET['id']);
} else {
    $stmt = $conexao->prepare($sql . " WHERE $acesso AND p.status_partida <> 'cancelada' AND p.data_hora >= NOW() ORDER BY p.data_hora");
    $stmt->bind_param('iiii', $eu, $eu, $admin, $eu);
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
