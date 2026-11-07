document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    carregarOpcoes();
});

async function carregarOpcoes() {
    let retorno  = await fetch('../php/quadra_get.php?aprovadas=1');
    let resposta = await retorno.json();
    let html = '';
    for (const q of resposta.data) {
        html += `<option value='${q.id_quadra}'>${q.nome_quadra}</option>`;
    }
    document.getElementById('id_quadra').innerHTML = html;

    retorno  = await fetch('../php/modalidade_get.php');
    resposta = await retorno.json();
    html = '';
    for (const m of resposta.data) {
        html += `<option value='${m.id_modalidade}'>${m.nome}</option>`;
    }
    document.getElementById('id_modalidade').innerHTML = html;
}

document.getElementById('enviar').addEventListener('click', () => {
    novo();
});

async function novo() {
    const fd = new FormData();
    fd.append('id_quadra',      document.getElementById('id_quadra').value);
    fd.append('id_modalidade',  document.getElementById('id_modalidade').value);
    fd.append('data',           document.getElementById('data').value);
    fd.append('horario_inicio', document.getElementById('horario_inicio').value);
    fd.append('horario_fim',    document.getElementById('horario_fim').value);
    fd.append('max_jogadores',  document.getElementById('max_jogadores').value);
    fd.append('descricao',      document.getElementById('descricao').value);
    fd.append('tipo_acesso',    document.getElementById('tipo_acesso').value);

    const retorno  = await fetch('../php/partida_novo.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'partida_detalhe.html?id=' + resposta.data.id_partida;
    }
}
