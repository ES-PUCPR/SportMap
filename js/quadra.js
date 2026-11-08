let usuario = null; // Variável global para armazenar os dados do usuário logado

// Executa assim que o HTML (DOM) é totalmente carregado
document.addEventListener('DOMContentLoaded', async () => {
    usuario = await valida_sessao(); // Verifica se o usuário está logado
    buscar(); // Inicia a busca das quadras cadastradas
});

// Busca a lista de quadras no servidor
async function buscar() {
    const retorno  = await fetch('../php/quadra_get.php');
    const resposta = await retorno.json();
    
    // Se a requisição for bem-sucedida, preenche a tabela com os dados
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    }
}

// Envia uma requisição para excluir uma quadra específica
async function excluir(id) {
    const retorno  = await fetch('../php/quadra_excluir.php?id=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem); // Exibe o resultado da operação
    
    // Recarrega a página para atualizar a lista caso a exclusão dê certo
    if (resposta.status == 'ok') {
        window.location.reload();
    }
}

// Envia uma requisição para validar (aprovar ou reprovar) uma quadra
async function validar(id, status) {
    const fd = new FormData();
    fd.append('id_quadra', id);
    fd.append('status',    status);

    const retorno  = await fetch('../php/quadra_validar.php', {
        method: 'POST',
        body:   fd // Envia os dados via POST
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    
    // Atualiza a página se a validação ocorrer com sucesso
    if (resposta.status == 'ok') {
        window.location.reload();
    }
}

// Monta o HTML da tabela de quadras e insere na tela
function preencherTabela(tabela) {
    let html = `
        <table>
            <tr>
                <th>Quadra</th><th>Endereço</th><th>Situação</th><th>#</th>
            </tr>`;
            
    // Percorre todas as quadras retornadas pelo banco
    for (const q of tabela) {
        let botoes = '';
        
        // Se for admin e a quadra não estiver aprovada, mostra o botão de Aprovar
        if (usuario.admin == 1 && q.status_validacao != 'aprovada') {
            botoes += `<a href='#' onclick="validar(${q.id_quadra}, 'aprovada')">Aprovar</a> `;
        }
        // Se for admin e a quadra não estiver reprovada, mostra o botão de Reprovar
        if (usuario.admin == 1 && q.status_validacao != 'reprovada') {
            botoes += `<a href='#' class='perigo' onclick="validar(${q.id_quadra}, 'reprovada')">Reprovar</a> `;
        }
        
        // Adiciona a linha da quadra na tabela
        html += `
            <tr>
                <td>${q.nome_quadra}</td>
                <td>${q.endereco}</td>
                <td><span class='etiqueta ${q.status_validacao}'>${q.status_validacao}</span></td>
                <td>
                    ${botoes}
                    <a href='quadra_alterar.html?id=${q.id_quadra}'>Alterar</a>
                    <a href='#' class='perigo' onclick='excluir(${q.id_quadra})'>Excluir</a>
                </td>
            </tr>`;
    }
    html += '</table>';
    
    // Renderiza a tabela montada no elemento de ID 'lista'
    document.getElementById('lista').innerHTML = html;
}