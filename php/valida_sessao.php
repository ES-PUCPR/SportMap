<?php
    include_once('funcoes.php');

    $usuario = exigir_login($conexao);
    $conexao->close();
    responder('ok', '', $usuario);
