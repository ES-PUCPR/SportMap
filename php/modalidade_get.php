<?php
    // Lista as modalidades (Campo, Society, Futsal) para preencher filtros e formulários.
    include_once('funcoes.php');
    exigir_login($conexao);

    $resultado = $conexao->query("SELECT id_modalidade, nome, qnt_jogadores FROM modalidade ORDER BY id_modalidade");
    $tabela = $resultado->fetch_all(MYSQLI_ASSOC);
    $conexao->close();

    responder('ok', 'Consulta efetuada.', $tabela);
