
<?php
// Inclui o arquivo responsável pela conexão com o banco de dados
include_once('conexao.php');

// Cria um array que armazena o resultado da operação
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Verifica se foi informado um ID pela URL através do método GET
if (isset($_GET['id'])) {

    // Converte o ID recebido para um número inteiro
    $id = (int) $_GET['id'];

    // Recebe os dados enviados pelo formulário através do método POST
    $nome     = $_POST['nome'];
    $email    = $_POST['email'];
    $telefone = $_POST['telefone'];
    $posicao  = $_POST['posicao'];

    // Inicia uma transação no banco de dados
    // Permite confirmar as alterações ou desfazer tudo caso ocorra algum erro
    $conexao->begin_transaction();

    // Prepara o comando SQL para atualizar os dados do usuário na tabela usuario
    $stmt = $conexao->prepare('UPDATE usuario SET nome = ?, email = ?, telefone = ? WHERE id_usuario = ?');

    // Substitui os ? pelos valores recebidos
    // s = string (texto) e i = integer (número inteiro)
    $stmt->bind_param('sssi', $nome, $email, $telefone, $id);

    // Executa a atualização e guarda o resultado da operação
    $ok = $stmt->execute();

    // Fecha o comando preparado
    $stmt->close();

    // Cria o cadastro do jogador caso ele ainda não exista.
    // Se já existir, atualiza somente a posição.
    // O ON DUPLICATE KEY UPDATE evita criar um registro duplicado
    $stmt = $conexao->prepare('INSERT INTO jogador (id_usuario, posicao) VALUES (?, ?) ON DUPLICATE KEY UPDATE posicao = ?');

    // Associa o ID do usuário e a posição.
    // i = integer e s = string
    $stmt->bind_param('iss', $id, $posicao, $posicao);

    // Executa o cadastro ou a atualização da posição do jogador
    $stmt->execute();

    // Fecha o comando preparado
    $stmt->close();

    // Verifica se foi enviada uma nova senha.
    // Se o campo estiver vazio, mantém a senha atual
    if (!empty($_POST['senha'])) {

        // Criptografa a nova senha antes de armazená-la no banco de dados
        $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);

        // Prepara o comando SQL para atualizar a senha na tabela login
        $stmt = $conexao->prepare('UPDATE login SET senha = ? WHERE id_usuario = ?');

        // Associa a senha criptografada e o ID do usuário
        // s = string e i = integer
        $stmt->bind_param('si', $senha, $id);

        // Executa a atualização da senha
        $stmt->execute();

        // Fecha o comando preparado
        $stmt->close();
    }

    // Verifica se a atualização dos dados do usuário foi executada corretamente
    if ($ok) {

        // Confirma as alterações realizadas na transação
        $conexao->commit();

        // Informa que o registro foi alterado com sucesso
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro alterado com sucesso.';

    } else {

        // Desfaz as alterações realizadas caso ocorra algum erro
        $conexao->rollback();

        // Informa que não foi possível realizar a alteração
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Não foi possível alterar o registro.';
    }

} else {

    // Caso nenhum ID seja informado, retorna uma mensagem de erro
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'ID não informado.';
}

// Fecha a conexão com o banco de dados
$conexao->close();

// Define que a resposta será enviada no formato JSON
header('Content-type: application/json; charset=utf-8');

// Converte o array de retorno para JSON e envia a resposta
echo json_encode($retorno);
