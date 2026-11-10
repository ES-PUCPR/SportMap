<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$stmt = $conexao->prepare(
    "SELECT u.id_usuario, u.nome, u.email, l.senha,
            SUM(p.tipo_perfil = 'superadmin') AS admin,
            SUM(p.tipo_perfil = 'dono_quadra') AS dono
     FROM usuario u
     JOIN login l ON l.id_usuario = u.id_usuario
     LEFT JOIN usuario_perfil up ON up.id_usuario = u.id_usuario
     LEFT JOIN perfil_acesso p ON p.id_perfil = up.id_perfil
     WHERE u.email = ? AND u.ativo = 1
     GROUP BY u.id_usuario, u.nome, u.email, l.senha"
);
$stmt->bind_param('s', $_POST['email']);
$stmt->execute();
$resultado = $stmt->get_result();

$tabela = [];
while ($linha = $resultado->fetch_assoc()) {
    $tabela[] = $linha;
}

if (count($tabela) > 0 && password_verify($_POST['senha'], $tabela[0]['senha'])) {
    unset($tabela[0]['senha']);
    session_start();
    $_SESSION['usuario'] = $tabela;
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Login efetuado com sucesso.';
    $retorno['data']     = $tabela;
} else {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Credenciais inválidas.';
}

$stmt->close();
$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
