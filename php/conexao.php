<?php
// Variáveis de conexão com o Banco de Dados
$servidor   = "localhost";
$usuario    = "root";
$senha      = "";
$nome_banco = "sportmap";

date_default_timezone_set('America/Sao_Paulo');

// Qualquer erro do banco vira uma resposta JSON padrão; o detalhe fica só no log do servidor.
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
set_exception_handler(function ($erro) {
    error_log($erro->getMessage());
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        'status'   => 'nok',
        'mensagem' => 'Erro interno. Tente novamente em instantes.',
        'data'     => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
$conexao->set_charset("utf8mb4");
