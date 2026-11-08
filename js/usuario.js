
// Aguarda o carregamento completo do HTML antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Verifica se o usuário possui uma sessão válida
    valida_sessao();

    // Chama a função responsável por buscar os usuários no banco de dados
    buscar();
});

// Cria uma função assíncrona responsável por buscar os usuários
async function buscar() {

    // Faz uma requisição ao arquivo PHP usuario_get.php para consultar os usuários
    const retorno = await fetch('../php/usuario_get.php');

    // Converte a resposta recebida do PHP para o formato JSON
    const resposta = await retorno.json();

    // Verifica se a consulta foi realizada com sucesso
    if (resposta.status == 'ok') {

        // Envia os dados recebidos para a função que preenche a tabela
        preencherTabela(resposta.data);
    }
}

// Cria uma função assíncrona responsável por excluir (desativar) um usuário
// Recebe como parâmetro o ID do usuário
async function excluir(id) {

    // Envia uma requisição ao PHP informando o ID do usuário pela URL
    const retorno = await fetch('../php/usuario_excluir.php?id=' + id);

    // Converte a resposta recebida do PHP para JSON
    const resposta = await retorno.json();

    // Exibe uma mensagem informando o resultado da operação
    alert(resposta.mensagem);

    // Verifica se a exclusão foi realizada com sucesso
    if (resposta.status == 'ok') {

        // Recarrega a página para atualizar a tabela com os dados mais recentes
        window.location.reload();
    }
}

// Cria uma função responsável por montar e preencher a tabela de usuários
// Recebe como parâmetro a tabela contendo os dados dos usuários
function preencherTabela(tabela) {

    // Cria uma variável para armazenar o código HTML da tabela
    // Inicialmente, adiciona os títulos das colunas
    let html = `
        <table>
            <tr>
                <th>Nome</th><th>E-mail</th><th>Telefone</th>
                <th>Posição</th><th>Ativo</th><th>#</th>
            </tr>`;

    // Percorre todos os usuários recebidos pela função
    for (const u of tabela) {

        // Cria uma variável vazia para armazenar o link de exclusão
        let excluir = '';

        // Verifica se o usuário está ativo
        if (u.ativo == 1) {

            // Se estiver ativo, cria um link para excluir (desativar) o usuário
            // O onclick chama a função excluir() passando o ID do usuário
            excluir = `<a href='#' class='perigo' onclick='excluir(${u.id_usuario})'>Excluir</a>`;
        }

        // Adiciona uma nova linha à tabela com os dados do usuário atual
        html += `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || ''}</td>
                <td>${u.posicao || ''}</td>

                <td>
                    <span class='etiqueta ${u.ativo == 1 ? '' : 'inativo'}'>
                        ${u.ativo == 1 ? 'Sim' : 'Não'}
                    </span>
                </td>

                <td>
                    <a href='usuario_alterar.html?id=${u.id_usuario}'>Alterar</a>
                    ${excluir}
                </td>
            </tr>`;
    }

    // Fecha a estrutura da tabela HTML
    html += '</table>';

    // Insere o código HTML criado dentro do elemento que possui o ID "lista"
    document.getElementById('lista').innerHTML = html;
}
