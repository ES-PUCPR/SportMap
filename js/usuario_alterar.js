
// Fase 1 - Buscar os dados do usuário

// Aguarda o carregamento completo do HTML antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Verifica se o usuário possui uma sessão válida
    valida_sessao();

    // Cria um objeto URLSearchParams para ler os parâmetros presentes na URL
    const url = new URLSearchParams(window.location.search);

    // Recupera o valor do parâmetro id presente na URL
    const id = url.get('id');

    // Chama a função buscar() passando o ID do usuário
    buscar(id);
});

// Cria uma função assíncrona responsável por buscar os dados de um usuário
// Recebe o ID do usuário como parâmetro
async function buscar(id) {

    // Envia uma requisição ao arquivo PHP para buscar o usuário pelo ID
    const retorno = await fetch('../php/usuario_get.php?id=' + id);

    // Converte a resposta recebida do PHP para o formato JSON
    const resposta = await retorno.json();

    // Verifica se a consulta foi realizada com sucesso
    if (resposta.status == 'ok') {

        // Armazena os dados do primeiro registro encontrado na variável reg
        const reg = resposta.data[0];

        // Preenche os campos do formulário com os dados recebidos do banco
        document.getElementById('nome').value = reg.nome;
        document.getElementById('cpf').value = reg.cpf;
        document.getElementById('email').value = reg.email;
        document.getElementById('telefone').value = reg.telefone;
        document.getElementById('posicao').value = reg.posicao || '';

        // Preenche o campo oculto ou interno do formulário com o ID do usuário
        document.getElementById('id').value = id;

    } else {

        // Exibe uma mensagem caso não seja possível encontrar o usuário
        alert(resposta.mensagem);

        // Redireciona o usuário para a página inicial da área home
        window.location.href = '../home/';
    }
}


// Fase 2 - Alterar os dados do usuário

// Busca o botão com o ID "enviar" e adiciona um evento de clique
document.getElementById('enviar').addEventListener('click', () => {

    // Quando o botão for clicado, chama a função alterar()
    alterar();
});

// Cria uma função assíncrona responsável por enviar as alterações do usuário
async function alterar() {

    // Recupera o ID do usuário armazenado no campo com ID "id"
    const id = document.getElementById('id').value;

    // Cria um objeto FormData para organizar os dados que serão enviados ao PHP
    const fd = new FormData();

    // Busca os valores dos campos do formulário e adiciona ao FormData
    fd.append('nome', document.getElementById('nome').value);
    fd.append('email', document.getElementById('email').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('posicao', document.getElementById('posicao').value);
    fd.append('senha', document.getElementById('senha').value);

    // Envia os dados para o arquivo PHP utilizando o método POST
    // O ID do usuário é enviado pela URL através do método GET
    const retorno = await fetch('../php/usuario_alterar.php?id=' + id, {
        method: 'POST',
        body: fd
    });

    // Converte a resposta recebida do PHP para o formato JSON
    const resposta = await retorno.json();

    // Exibe uma mensagem informando o resultado da alteração
    alert(resposta.mensagem);

    // Verifica se a alteração foi realizada com sucesso
    if (resposta.status == 'ok') {

        // Redireciona o usuário para a página inicial da área home
        window.location.href = '../home/';
    }
}
