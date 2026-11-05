<?php
    include_once('funcoes.php');
    exigir_post();

    iniciar_sessao();
    $_SESSION = [];
    session_destroy();

    $conexao->close();
    responder('ok', 'Sessão encerrada.');
