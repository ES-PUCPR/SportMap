<?php
$servidor   = 'localhost:3306';
$usuario    = 'sportmap_app';
$senha      = 'pucpr2026';
$nome_banco = 'sportmap';

mysqli_report(MYSQLI_REPORT_OFF);

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);

if ($conexao->connect_error) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'nok', 'mensagem' => 'Falha na conexão: ' . $conexao->connect_error, 'data' => []
    ]);
    exit;
}

$conexao->set_charset('utf8mb4');
