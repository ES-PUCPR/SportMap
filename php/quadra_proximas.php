<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Recebe as coordenadas do usuário para buscar quadras próximas
$lat = (float) $_GET['lat'];
$lng = (float) $_GET['lng'];

// A fórmula de Haversine calcula a distância em km entre dois pontos da Terra baseando-se em suas latitudes/longitudes.
$stmt = $conexao->prepare(
    "SELECT q.id_quadra, q.nome_quadra, q.endereco, q.latitude, q.longitude,
            6371 * ACOS(LEAST(1,
                COS(RADIANS(?)) * COS(RADIANS(q.latitude)) * COS(RADIANS(q.longitude) - RADIANS(?))
                + SIN(RADIANS(?)) * SIN(RADIANS(q.latitude))
            )) AS distancia
     FROM quadra q
     WHERE q.status_validacao = 'aprovada' AND q.latitude IS NOT NULL
     ORDER BY distancia" // Retorna ordenado da mais próxima para a mais distante
);
$stmt->bind_param('ddd', $lat, $lng, $lat);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
// Armazena os resultados na resposta
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