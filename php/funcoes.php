<?php
// Funções usadas por todos os CRUDs. Todo arquivo da API começa com include_once('funcoes.php').
include_once('conexao.php');

// Padrão de retorno de todas as situações: status (ok/nok), mensagem e data.
function responder($status, $mensagem, $data = []) {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        'status'   => $status,
        'mensagem' => $mensagem,
        'data'     => $data
    ], JSON_UNESCAPED_UNICODE);
    exit; // uma transação aberta e não confirmada é desfeita quando a conexão fecha aqui
}

// ---------- Sessão e permissões ----------

function iniciar_sessao() {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
        session_start();
    }
}

// Tudo que altera dados só aceita POST.
function exigir_post() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder('nok', 'Método não permitido.');
    }
}

// Devolve o usuário logado ou encerra com erro. Usuário desativado perde o acesso na hora.
function exigir_login($conexao) {
    iniciar_sessao();
    if (!isset($_SESSION['usuario'])) {
        responder('nok', 'Faça login para continuar.');
    }
    $id = $_SESSION['usuario']['id_usuario'];
    $stmt = $conexao->prepare("SELECT ativo FROM usuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $linha = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$linha || (int) $linha['ativo'] !== 1) {
        session_destroy();
        responder('nok', 'Faça login para continuar.');
    }
    return $_SESSION['usuario'];
}

function tem_perfil($usuario, $perfil) {
    return in_array($perfil, $usuario['perfis']);
}

function eh_admin($usuario) {
    return tem_perfil($usuario, 'superadmin');
}

function buscar_perfis($conexao, $id_usuario) {
    $stmt = $conexao->prepare("
        SELECT p.tipo_perfil FROM usuario_perfil up
        JOIN perfil_acesso p ON p.id_perfil = up.id_perfil
        WHERE up.id_usuario = ?");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $perfis = [];
    while ($linha = $resultado->fetch_assoc()) {
        $perfis[] = $linha['tipo_perfil'];
    }
    $stmt->close();
    return $perfis;
}

// ---------- Validação de campos ----------

function texto_post($campo) {
    return trim($_POST[$campo] ?? '');
}

function exigir_tamanho($valor, $maximo, $rotulo) {
    if (mb_strlen($valor) > $maximo) {
        responder('nok', "$rotulo deve ter no máximo $maximo caracteres.");
    }
}

function cpf_valido($cpf) {
    if (!preg_match('/^\d{11}$/', $cpf) || preg_match('/^(\d)\1{10}$/', $cpf)) {
        return false;
    }
    for ($t = 9; $t < 11; $t++) {
        $soma = 0;
        for ($i = 0; $i < $t; $i++) {
            $soma += (int) $cpf[$i] * (($t + 1) - $i);
        }
        $digito = ((10 * $soma) % 11) % 10;
        if ((int) $cpf[$t] !== $digito) {
            return false;
        }
    }
    return true;
}

function data_valida($data) {
    $d = DateTime::createFromFormat('Y-m-d', $data);
    return $d && $d->format('Y-m-d') === $data;
}

function posicao_valida($posicao) {
    return in_array($posicao, ['', 'Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante']);
}

// ---------- Jogador e partida (usados por partida_* e escalacao_*) ----------

// Devolve o id_jogador do usuário, criando o registro de jogador se ainda não existir.
function id_jogador($conexao, $id_usuario) {
    $stmt = $conexao->prepare("SELECT id_jogador FROM jogador WHERE id_usuario = ?");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $linha = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if ($linha) {
        return (int) $linha['id_jogador'];
    }
    $stmt = $conexao->prepare("INSERT INTO jogador (id_usuario) VALUES (?)");
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();
    return $id;
}

// $bloquear = true trava a linha até o fim da transação, para duas pessoas não pegarem a última vaga.
function carregar_partida($conexao, $id_partida, $bloquear = false) {
    $sql = "SELECT * FROM partida WHERE id_partida = ?" . ($bloquear ? " FOR UPDATE" : "");
    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $id_partida);
    $stmt->execute();
    $partida = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $partida;
}

function pode_gerir_partida($usuario, $partida) {
    return eh_admin($usuario) || (int) $partida['id_organizador'] === (int) $usuario['id_usuario'];
}

// Partida só por convite fica visível apenas para organizador, admin e convidados.
function pode_ver_partida($conexao, $usuario, $partida) {
    if ($partida['tipo_acesso'] !== 'privada_convite' || pode_gerir_partida($usuario, $partida)) {
        return true;
    }
    $stmt = $conexao->prepare("
        SELECT 1 FROM escalacao e
        JOIN jogador j ON j.id_jogador = e.id_jogador
        WHERE e.id_partida = ? AND j.id_usuario = ? AND e.status_participacao <> 'recusado'");
    $stmt->bind_param("ii", $partida['id_partida'], $usuario['id_usuario']);
    $stmt->execute();
    $existe = $stmt->get_result()->num_rows > 0;
    $stmt->close();
    return $existe;
}

function contar_confirmados($conexao, $id_partida) {
    $stmt = $conexao->prepare("
        SELECT COUNT(*) AS total FROM escalacao
        WHERE id_partida = ? AND status_participacao = 'confirmado'");
    $stmt->bind_param("i", $id_partida);
    $stmt->execute();
    $total = (int) $stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();
    return $total;
}

// Mantém o status em dia: "completa" quando as vagas acabam e "aberta" quando uma vaga é liberada.
function atualizar_status_partida($conexao, $id_partida) {
    $stmt = $conexao->prepare("
        UPDATE partida p
        SET p.status_partida = IF(
            (SELECT COUNT(*) FROM escalacao e
             WHERE e.id_partida = p.id_partida AND e.status_participacao = 'confirmado') >= p.max_jogadores,
            'completa', 'aberta')
        WHERE p.id_partida = ? AND p.status_partida IN ('aberta', 'completa')");
    $stmt->bind_param("i", $id_partida);
    $stmt->execute();
    $stmt->close();
}
