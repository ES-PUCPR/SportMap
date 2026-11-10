<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$lat = (float) $_GET['lat'];
$lng = (float) $_GET['lng'];

// Distância em km pela lei esférica dos cossenos; LEAST(1, ...) evita ACOS fora do domínio
$stmt = $conexao->prepare(
    "SELECT q.id_quadra, q.nome_quadra, q.endereco, q.latitude, q.longitude,
            6371 * ACOS(LEAST(1,
                COS(RADIANS(?)) * COS(RADIANS(q.latitude)) * COS(RADIANS(q.longitude) - RADIANS(?))
                + SIN(RADIANS(?)) * SIN(RADIANS(q.latitude))
            )) AS distancia
     FROM quadra q
     WHERE q.status_validacao = 'aprovada' AND q.latitude IS NOT NULL
     ORDER BY distancia"
);
$stmt->bind_param('ddd', $lat, $lng, $lat);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while ($linha = $resultado->fetch_assoc()) {
    $tabela[] = $linha;
}
$retorno['status']   = 'ok';
$retorno['mensagem'] = 'Consulta efetuada.';
$retorno['data']     = $tabela;

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
