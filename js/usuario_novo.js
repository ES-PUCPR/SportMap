
// Busca o elemento com o ID "enviar" e adiciona um evento de clique
document.getElementById('enviar').addEventListener('click', () => {

    // Quando o botão for clicado, chama a função novo()
    novo();
});

// Cria uma função assíncrona responsável por cadastrar um novo usuário
async function novo() {

    // Cria um objeto FormData para armazenar os dados que serão enviados ao PHP
    const fd = new FormData();

    // Busca os valores dos campos do formulário e adiciona ao FormData
    fd.append('nome', document.getElementById('nome').value);
    fd.append('cpf', document.getElementById('cpf').value);
    fd.append('email', document.getElementById('email').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('posicao', document.getElementById('posicao').value);
    fd.append('senha', document.getElementById('senha').value);

    // Verifica se a opção dono_quadra está marcada
    if (document.getElementById('dono_quadra').checked) {

        // Se estiver marcada, adiciona dono_quadra ao FormData com o valor 1
        fd.append('dono_quadra', '1');
    }

    // Envia os dados para o arquivo PHP utilizando o método POST
    // O await aguarda a resposta do servidor antes de continuar
    const retorno = await fetch('../php/usuario_novo.php', {
        method: 'POST',
        body: fd
    });

    // Converte a resposta recebida do PHP para o formato JSON
    const resposta = await retorno.json();

    // Exibe uma mensagem informando o resultado do cadastro
    alert(resposta.mensagem);

    // Verifica se o cadastro foi realizado com sucesso
    if (resposta.status == 'ok') {

        // Redireciona o usuário para a página index.html
        window.location.href = 'index.html';
    }
}
