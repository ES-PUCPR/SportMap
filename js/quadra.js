let usuario = null;

document.addEventListener('DOMContentLoaded', async () => {
    usuario = await validaSessao();
    buscar();
});

async function buscar() {
    const retorno  = await fetch('../php/quadra_get.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    }
}

async function excluir(id) {
    const retorno  = await fetch('../php/quadra_excluir.php?id=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.reload();
    }
}

async function validar(id, status) {
    const fd = new FormData();
    fd.append('id_quadra', id);
    fd.append('status',    status);

    const retorno  = await fetch('../php/quadra_validar.php', {
        method: 'POST',
        body:   fd
    });
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
                <th>Quadra</th><th>Endereço</th><th>Situação</th><th>#</th>
            </tr>`;
    for (const q of tabela) {
        let botoes = '';
        if (usuario.admin == 1 && q.status_validacao != 'aprovada') {
            botoes += `<a href='#' onclick="validar(${q.id_quadra}, 'aprovada')">Aprovar</a> `;
        }
        if (usuario.admin == 1 && q.status_validacao != 'reprovada') {
            botoes += `<a href='#' class='perigo' onclick="validar(${q.id_quadra}, 'reprovada')">Reprovar</a> `;
        }
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
    document.getElementById('lista').innerHTML = html;
}
