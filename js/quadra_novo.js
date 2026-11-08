// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    valida_sessao(); // Verifica se o usuário tem permissão de acesso

    // Liga o campo de endereço à API de geolocalização para preencher lat/long
    ligarEndereco('endereco', (sugestao) => {
        document.getElementById('latitude').value  = sugestao ? sugestao.latitude : '';
        document.getElementById('longitude').value = sugestao ? sugestao.longitude : '';
    });
});

// Dispara a função 'novo' ao clicar no botão de enviar
document.getElementById('enviar').addEventListener('click', () => {
    novo();
});

// Cadastra uma nova quadra no sistema
async function novo() {
    const fd = new FormData();
    
    // Coleta os dados digitados pelo usuário
    fd.append('nome_quadra', document.getElementById('nome_quadra').value);
    fd.append('endereco',    document.getElementById('endereco').value);
    fd.append('tipo_quadra', document.getElementById('tipo_quadra').value);
    fd.append('latitude',    document.getElementById('latitude').value);
    fd.append('longitude',   document.getElementById('longitude').value);

    // Envia para o script PHP de cadastro
    const retorno  = await fetch('../php/quadra_novo.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    
    // Em caso de sucesso, retorna para a tela de listagem
    if (resposta.status == 'ok') {
        window.location.href = 'quadra.html';
    }
}