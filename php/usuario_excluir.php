
<?php
// Inclui o arquivo responsável pela conexão com o banco de dados
include_once('conexao.php');

// Cria um array que armazena o resultado da operação
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Verifica se foi informado um ID pela URL através do método GET
if (isset($_GET['id'])) {

    // Inicia uma transação no banco de dados
    // Permite confirmar a operação ou desfazê-la caso ocorra algum erro
    $conexao->begin_transaction();

    // Prepara o comando SQL para desativar a conta do usuário
    // O ativo = 0 indica que a conta está desativada
    $stmt = $conexao->prepare('UPDATE usuario SET ativo = 0 WHERE id_usuario = ?');

    // Substitui o ? pelo ID recebido
    // O i indica que o valor é do tipo inteiro
    $stmt->bind_param('i', $_GET['id']);

    // Executa a atualização no banco de dados
    $stmt->execute();

    // Verifica se algum registro foi alterado
    if ($stmt->affected_rows > 0) {

        // Confirma a operação realizada no banco de dados
        $conexao->commit();

        // Informa que o registro foi excluído (desativado) com sucesso
        $retorno['status']   = 'ok';
        $retorno['mensagem'] = 'Registro excluído.';

    } else {

        // Desfaz a transação caso nenhum registro tenha sido alterado
        $conexao->rollback();

        // Informa que o registro não foi excluído
        $retorno['status']   = 'nok';
        $retorno['mensagem'] = 'Registro não excluído.';
    }

    // Fecha o comando preparado
    $stmt->close();

} else {

    // Caso nenhum ID tenha sido informado, retorna uma mensagem de erro
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'É necessário informar um ID para exclusão.';
}

// Fecha a conexão com o banco de dados
$conexao->close();

// Define que a resposta será enviada no formato JSON
header('Content-type: application/json; charset=utf-8');

// Converte o array de retorno para JSON e envia a resposta
echo json_encode($retorno);
