document.addEventListener('DOMContentLoaded', () => {
    validaSessao();
    buscar();
});

async function buscar() {
    const retorno  = await fetch('../php/usuario_get.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    }
}

async function excluir(id) {
    const retorno  = await fetch('../php/usuario_excluir.php?id=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.reload();
    }
}

function preencherTabela(tabela) {
    let html = `
        <table>
            <tr>
                <th>Nome</th><th>E-mail</th><th>Telefone</th>
                <th>Posição</th><th>Ativo</th><th>#</th>
            </tr>`;
    for (const u of tabela) {
        let excluir = '';
        if (u.ativo == 1) {
            excluir = `<a href='#' class='perigo' onclick='excluir(${u.id_usuario})'>Excluir</a>`;
        }
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
    html += '</table>';
    document.getElementById('lista').innerHTML = html;
}
