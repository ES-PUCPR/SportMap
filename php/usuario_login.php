<?php
    include_once('funcoes.php');
    exigir_post();

    $email = texto_post('email');
    $senha = $_POST['senha'] ?? '';

    $stmt = $conexao->prepare("
        SELECT u.id_usuario, u.nome, u.email, l.senha
        FROM usuario u
        JOIN login l ON l.id_usuario = u.id_usuario
        WHERE u.email = ? AND u.ativo = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $linha = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    // A mesma mensagem para e-mail e senha errados, para não revelar quais e-mails existem.
    if (!$linha || !password_verify($senha, $linha['senha'])) {
        responder('nok', 'E-mail ou senha inválidos.');
    }

    iniciar_sessao();
    session_regenerate_id(true);
    $_SESSION['usuario'] = [
        'id_usuario' => (int) $linha['id_usuario'],
        'nome'       => $linha['nome'],
        'email'      => $linha['email'],
        'perfis'     => buscar_perfis($conexao, (int) $linha['id_usuario'])
    ];

    $conexao->close();
    responder('ok', 'Login efetuado.', $_SESSION['usuario']);
