let partidas = [];

document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    // O mapa abre esta tela com o nome da quadra na URL
    const url = new URLSearchParams(window.location.search);
    document.getElementById('local').value = url.get('local') || '';
    carregarModalidades();
    buscar();
});

document.getElementById('filtrar').addEventListener('click', () => {
    preencherLista();
});

async function carregarModalidades() {
    const retorno  = await fetch('../php/modalidade_get.php');
    const resposta = await retorno.json();
    let html = `<option value=''>Todas</option>`;
    for (const m of resposta.data) {
        html += `<option value='${m.id_modalidade}'>${m.nome}</option>`;
    }
    document.getElementById('modalidade').innerHTML = html;
}

async function buscar() {
    const retorno  = await fetch('../php/partida_get.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        partidas = resposta.data;
    }
    preencherLista();
}

function preencherLista() {
    const local      = document.getElementById('local').value.toLowerCase();
    const data       = document.getElementById('data').value;
    const hora       = document.getElementById('hora').value;
    const modalidade = document.getElementById('modalidade').value;

    let html = '';
    for (const p of partidas) {
        const textoLocal = (p.nome_quadra + ' ' + p.endereco).toLowerCase();
        if (local != '' && !textoLocal.includes(local)) continue;
        if (data != '' && p.data_hora.substring(0, 10) != data) continue;
        if (hora != '' && p.horario_inicio < hora) continue;
        if (modalidade != '' && p.id_modalidade != modalidade) continue;

        html += `
            <div class='caixa'>
                <div>
                    <span class='etiqueta'>${p.modalidade}</span>
                    <span class='etiqueta ${p.tipo_acesso}'>${TIPOS_PARTIDA[p.tipo_acesso]}</span>
                    ${p.minha_situacao == 'convidado' ? `<span class='etiqueta convidado'>Você foi convidado</span>` : ''}
                </div>
                <h3>${p.nome_quadra}</h3>
                <p>${p.endereco}</p>
                <p><b>Data:</b> ${p.data_hora.substring(0, 16)}</p>
                <p><b>Vagas:</b> ${p.max_jogadores - p.confirmados}</p>
                <div class='barra'><div style='width: ${p.confirmados / p.max_jogadores * 100}%'></div></div>
                <a href='partida_detalhe.html?id=${p.id_partida}'>Ver partida</a>
            </div>`;
    }
    if (html == '') {
        html = '<p>Nenhuma partida encontrada.</p>';
    }
    document.getElementById('lista').innerHTML = html;
}
