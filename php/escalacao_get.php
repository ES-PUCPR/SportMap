<?php
include_once('conexao.php');
session_start();
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$logado = $_SESSION['usuario'][0] ?? ['id_usuario' => 0, 'admin' => 0];
$eu = $logado['id_usuario'];
$admin = (int) $logado['admin'];

// O organizador e o admin veem todos. Os demais veem a própria linha e os confirmados,
// os confirmados de uma partida por convite só aparecem para quem faz parte dela.
$stmt = $conexao->prepare(
    "SELECT e.id_jogador, e.posicao, e.status_participacao, u.nome, (u.id_usuario = ?) AS eu
     FROM escalacao e
     JOIN jogador j ON j.id_jogador = e.id_jogador
     JOIN usuario u ON u.id_usuario = j.id_usuario
     JOIN partida p ON p.id_partida = e.id_partida
     WHERE e.id_partida = ?
       AND (p.id_organizador = ? OR ? = 1 OR u.id_usuario = ?
            OR (e.status_participacao = 'confirmado'
                AND (p.tipo_acesso <> 'privada_convite'
                     OR EXISTS (SELECT 1 FROM escalacao e2 JOIN jogador j2 ON j2.id_jogador = e2.id_jogador
                                WHERE e2.id_partida = p.id_partida AND j2.id_usuario = ?))))"
);
$stmt->bind_param('iiiiii', $eu, $_GET['id_partida'], $eu, $admin, $eu, $eu);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while ($linha = $resultado->fetch_assoc()){
    $tabela[] = $linha;
}
$retorno['status']   = 'ok';
$retorno['mensagem'] = 'Consulta efetuada.';
$retorno['data']     = $tabela;

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
