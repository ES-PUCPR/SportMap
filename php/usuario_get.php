
<?php
// Inclui o arquivo responsável pela conexão com o banco de dados
include_once('conexao.php');

// Cria um array que armazena o resultado da consulta
$retorno = ['status' => '', 'mensagem' => '', 'data' => []];

// Monta a consulta SQL para buscar os dados dos usuários
// O LEFT JOIN permite trazer os dados do usuário mesmo que ele não tenha um cadastro na tabela jogador
$sql = 'SELECT u.id_usuario, u.nome, u.cpf, u.email, u.telefone, u.ativo, j.posicao
        FROM usuario u
        LEFT JOIN jogador j ON j.id_usuario = u.id_usuario';

// Verifica se foi enviado um ID pela URL através do método GET
if (isset($_GET['id'])) {

    // Prepara a consulta SQL adicionando uma condição para buscar um usuário específico pelo ID
    $stmt = $conexao->prepare($sql . ' WHERE u.id_usuario = ?');

    // Substitui o ? pelo ID recebido.
    // O i indica que o valor é do tipo inteiro
    $stmt->bind_param('i', $_GET['id']);

} else {

    // Caso nenhum ID tenha sido informado, prepara a consulta para buscar todos os usuários
    $stmt = $conexao->prepare($sql);
}

// Executa a consulta SQL
$stmt->execute();

// Recupera o resultado da consulta realizada no banco de dados
$resultado = $stmt->get_result();

// Cria um array vazio para armazenar os registros encontrados
$tabela = [];

// Verifica se a consulta retornou algum registro
if ($resultado->num_rows > 0) {

    // Percorre todos os registros encontrados
    while ($linha = $resultado->fetch_assoc()) {

        // Adiciona cada registro ao array tabela
        // O fetch_assoc() organiza os dados em um array associativo,
        // utilizando os nomes das colunas como índices
        $tabela[] = $linha;
    }

    // Informa que a consulta foi realizada com sucesso
    $retorno['status']   = 'ok';
    $retorno['mensagem'] = 'Consulta efetuada.';

    // Armazena os registros encontrados dentro do campo data
    $retorno['data']     = $tabela;

} else {

    // Caso nenhum registro seja encontrado, informa que não há dados
    $retorno['status']   = 'nok';
    $retorno['mensagem'] = 'Não há registros.';
}

// Fecha o comando preparado
$stmt->close();

// Fecha a conexão com o banco de dados
$conexao->close();

// Define que a resposta será enviada no formato JSON
header('Content-type: application/json; charset=utf-8');

// Converte o array de retorno para JSON e envia a resposta
echo json_encode($retorno);
