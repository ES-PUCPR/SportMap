// Fase 1
document.addEventListener('DOMContentLoaded', async () => {
    valida_sessao();
    const url = new URLSearchParams(window.location.search);
    const id  = url.get('id');
    await carregarOpcoes();
    buscar(id);
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

async function buscar(id) {
    const retorno  = await fetch('../php/partida_get.php?id=' + id);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        document.getElementById('id_quadra').value      = reg.id_quadra;
        document.getElementById('id_modalidade').value  = reg.id_modalidade;
        document.getElementById('data').value           = reg.data_hora.substring(0, 10);
        document.getElementById('horario_inicio').value = reg.horario_inicio.substring(0, 5);
        document.getElementById('horario_fim').value    = reg.horario_fim.substring(0, 5);
        document.getElementById('max_jogadores').value  = reg.max_jogadores;
        document.getElementById('descricao').value      = reg.descricao;
        document.getElementById('tipo_acesso').value    = reg.tipo_acesso;
        document.getElementById('id').value             = id;
    } else {
        alert(resposta.mensagem);
        window.location.href = '../home/';
    }
}

// Fase 2
document.getElementById('enviar').addEventListener('click', () => {
    alterar();
});

async function alterar() {
    const id = document.getElementById('id').value;
    const fd = new FormData();
    fd.append('id_quadra',      document.getElementById('id_quadra').value);
    fd.append('id_modalidade',  document.getElementById('id_modalidade').value);
    fd.append('data',           document.getElementById('data').value);
    fd.append('horario_inicio', document.getElementById('horario_inicio').value);
    fd.append('horario_fim',    document.getElementById('horario_fim').value);
    fd.append('max_jogadores',  document.getElementById('max_jogadores').value);
    fd.append('descricao',      document.getElementById('descricao').value);
    fd.append('tipo_acesso',    document.getElementById('tipo_acesso').value);

    const retorno  = await fetch('../php/partida_alterar.php?id=' + id, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'partida_detalhe.html?id=' + id;
    }
}
