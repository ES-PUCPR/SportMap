// Fase 1: Carregamento inicial e busca dos dados
document.addEventListener('DOMContentLoaded', () => {
    valida_sessao(); // Garante que o usuário está logado
    
    // Captura o ID da quadra através dos parâmetros da URL
    const url = new URLSearchParams(window.location.search);
    const id  = url.get('id');
    buscar(id); // Busca os dados atuais da quadra

    // Ativa a funcionalidade de autocompletar e buscar coordenadas do endereço
    ligarEndereco('endereco', (sugestao) => {
        document.getElementById('latitude').value  = sugestao ? sugestao.latitude : '';
        document.getElementById('longitude').value = sugestao ? sugestao.longitude : '';
    });
});

// Busca as informações da quadra pelo ID para preencher o formulário
async function buscar(id) {
    const retorno  = await fetch('../php/quadra_get.php?id=' + id);
    const resposta = await retorno.json();
    
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        // Preenche os campos do formulário com os dados vindos do banco
        document.getElementById('nome_quadra').value = reg.nome_quadra;
        document.getElementById('endereco').value    = reg.endereco;
        document.getElementById('tipo_quadra').value = reg.tipo_quadra;
        document.getElementById('latitude').value    = reg.latitude;
        document.getElementById('longitude').value   = reg.longitude;
        document.getElementById('id').value          = id;
    } else {
        // Se houver erro ou não encontrar a quadra, volta para a listagem
        alert(resposta.mensagem);
        window.location.href = 'quadra.html';
    }
}

// Fase 2: Escuta o clique no botão de enviar para salvar as alterações
document.getElementById('enviar').addEventListener('click', () => {
    alterar();
});

// Envia os dados atualizados para o servidor
async function alterar() {
    const id = document.getElementById('id').value;
    const fd = new FormData();
    
    // Coleta os valores atuais dos campos
    fd.append('nome_quadra', document.getElementById('nome_quadra').value);
    fd.append('endereco',    document.getElementById('endereco').value);
    fd.append('tipo_quadra', document.getElementById('tipo_quadra').value);
    fd.append('latitude',    document.getElementById('latitude').value);
    fd.append('longitude',   document.getElementById('longitude').value);

    // Dispara a requisição de alteração via POST
    const retorno  = await fetch('../php/quadra_alterar.php?id=' + id, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    
    // Se alterou com sucesso, redireciona de volta para a lista
    if (resposta.status == 'ok') {
        window.location.href = 'quadra.html';
    }
}