
<?php
// Inclui o arquivo responsável pela conexão com o banco de dados
include_once('conexao.php');

// Cria um array que armazena o resultado da operação
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Recebe os dados enviados pelo formulário através do método POST
$nome     = $_POST['nome'];
$cpf      = $_POST['cpf'];
$email    = $_POST['email'];
$telefone = $_POST['telefone'];
$posicao  = $_POST['posicao'];

// Criptografa a senha antes de armazená-la no banco de dados (evita vazamento de dados)
$senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);

// Verifica se o campo dono_quadra foi enviado.
// Se foi enviado, o perfil será dono_quadra. Caso contrário, será usuario.
$perfil = isset($_POST['dono_quadra']) ? 'dono_quadra' : 'usuario';

// Verifica se os campos obrigatórios foram preenchidos
if (empty($nome) || empty($email) || empty($_POST['senha'])) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Preencha nome, e-mail e senha.';

// Verifica se o CPF possui exatamente 11 caracteres
} else if (strlen($cpf) != 11) {
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'O CPF precisa ter 11 números.';

} else {
    // Inicia uma transação no banco de dados.
    // Isso permite confirmar todas as operações ou desfazer tudo caso ocorra algum erro.
    $conexao->begin_transaction();

    // Prepara o comando SQL para cadastrar os dados do usuário na tabela usuario
    $stmt = $conexao->prepare('INSERT INTO usuario (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)');

    // Substitui os ? pelos valores recebidos.
    // O s indica que todos os valores são do tipo string.
    $stmt->bind_param('ssss', $nome, $cpf, $email, $telefone);

    // Executa o comando SQL
    $stmt->execute();

    // Guarda a quantidade de linhas afetadas pela inserção
    $linhas = $stmt->affected_rows;

    // Recupera o ID gerado automaticamente para o novo usuário
    $id_usuario = $stmt->insert_id;

    // Fecha o comando preparado
    $stmt->close();

    // Verifica se o usuário foi cadastrado corretamente
    if ($linhas > 0) {

        // Prepara o comando SQL para cadastrar o login do usuário
        $stmt = $conexao->prepare('INSERT INTO login (id_usuario, senha) VALUES (?, ?)');

        // Associa o ID do usuário e a senha criptografada aos campos do comando
        // i = integer (inteiro) e s = string (texto)
        $stmt->bind_param('is', $id_usuario, $senha);

        // Executa o cadastro do login
        $stmt->execute();
        $stmt->close();

        // Cadastra o perfil de acesso do usuário.
        // O SELECT busca o ID do perfil correspondente ao tipo informado.
        $stmt = $conexao->prepare('INSERT INTO usuario_perfil (id_usuario, id_perfil) SELECT ?, id_perfil FROM perfil_acesso WHERE tipo_perfil = ?');

        // Associa o ID do usuário e o tipo de perfil
        $stmt->bind_param('is', $id_usuario, $perfil);

        // Executa o cadastro do perfil
        $stmt->execute();
        $stmt->close();

        // Prepara o comando SQL para cadastrar a posição do jogador
        $stmt = $conexao->prepare('INSERT INTO jogador (id_usuario, posicao) VALUES (?, ?)');

        // Associa o ID do usuário e a posição escolhida
        $stmt->bind_param('is', $id_usuario, $posicao);

        // Executa o cadastro do jogador
        $stmt->execute();

        // Verifica quantas linhas foram afetadas pelo cadastro do jogador
        $linhas = $stmt->affected_rows;

        // Fecha o comando preparado
        $stmt->close();
    }

    // Verifica se o último cadastro foi realizado corretamente
    if ($linhas > 0) {

        // Confirma todas as operações realizadas na transação
        $conexao->commit();

        // Informa que o cadastro foi realizado com sucesso
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Conta criada com sucesso.';

    } else {
        // Desfaz todas as operações caso algum cadastro tenha falhado
        $conexao->rollback();

        // Informa que ocorreu um erro no cadastro
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Já existe uma conta com este e-mail ou CPF.';
    }
}

// Fecha a conexão com o banco de dados
$conexao->close();

// Define que a resposta será enviada no formato JSON
header('Content-type: application/json; charset=utf-8');

// Converte o array de retorno para JSON e envia a resposta
echo json_encode($retorno);
