document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    buscar();
});

async function buscar() {
    const retorno  = await fetch('../php/time_get.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        preencherTabela(resposta.data);
    }
}

async function excluir(id) {
    const retorno  = await fetch('../php/time_excluir.php?id=' + id);
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
                <th>Time</th><th>Sigla</th><th>Cidade</th>
                <th>Descrição</th><th>#</th>
            </tr>`;
    for (const t of tabela) {
        html += `
            <tr>
                <td>${t.nome}</td>
                <td>${t.sigla || ''}</td>
                <td>${t.cidade || ''}</td>
                <td>${t.descricao || ''}</td>
                <td>
                    <a href='time_alterar.html?id=${t.id_time}'>Alterar</a>
                    <a href='#' class='perigo' onclick='excluir(${t.id_time})'>Excluir</a>
                </td>
            </tr>`;
    }
    html += '</table>';
    document.getElementById('lista').innerHTML = html;
}
