<?php
include_once('conexao.php');
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

$nome     = $_POST['nome'];
$cpf      = $_POST['cpf'];
$email    = $_POST['email'];
$telefone = $_POST['telefone'];
$posicao  = $_POST['posicao'];
$senha    = password_hash($_POST['senha'], PASSWORD_DEFAULT);
$perfil   = isset($_POST['dono_quadra']) ? 'dono_quadra' : 'usuario';

if (empty($nome) || empty($email) || empty($_POST['senha'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Preencha nome, e-mail e senha.';
} else if (strlen($cpf) != 11) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'O CPF precisa ter 11 números.';
} else {
    $conexao->begin_transaction();

    $stmt = $conexao->prepare('INSERT INTO usuario (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $nome, $cpf, $email, $telefone);
    $stmt->execute();
    $linhas     = $stmt->affected_rows;
    $id_usuario = $stmt->insert_id;
    $stmt->close();

    if ($linhas > 0) {
        $stmt = $conexao->prepare('INSERT INTO login (id_usuario, senha) VALUES (?, ?)');
        $stmt->bind_param('is', $id_usuario, $senha);
        $stmt->execute();
        $stmt->close();

        $stmt = $conexao->prepare('INSERT INTO usuario_perfil (id_usuario, id_perfil) SELECT ?, id_perfil FROM perfil_acesso WHERE tipo_perfil = ?');
        $stmt->bind_param('is', $id_usuario, $perfil);
        $stmt->execute();
        $stmt->close();

        $stmt = $conexao->prepare('INSERT INTO jogador (id_usuario, posicao) VALUES (?, ?)');
        $stmt->bind_param('is', $id_usuario, $posicao);
        $stmt->execute();
        $linhas = $stmt->affected_rows;
        $stmt->close();
    }

    if ($linhas > 0) {
        $conexao->commit();
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Conta criada com sucesso.';
    } else {
        $conexao->rollback();
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Já existe uma conta com este e-mail ou CPF.';
    }
}

$conexao->close();

header('Content-type: application/json; charset=utf-8');
echo json_encode($retorno);
