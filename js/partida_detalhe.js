const url = new URLSearchParams(window.location.search);
const id  = url.get('id');
let usuario = null;

document.addEventListener('DOMContentLoaded', async () => {
    usuario = await validaSessao();
    buscar();
});

async function buscar() {
    let retorno  = await fetch('../php/partida_get.php?id=' + id);
    let resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const partida = resposta.data[0];
        mostrarPartida(partida);
        retorno  = await fetch('../php/escalacao_get.php?id_partida=' + id);
        resposta = await retorno.json();
        mostrarJogadores(resposta.data, partida);
    } else {
        alert(resposta.mensagem);
        window.location.href = '../home/';
    }
}

function mostrarPartida(p) {
    let html = `
        <h2>${p.modalidade}</h2>
        <p>${p.nome_quadra}</p>
        <p>${p.endereco}</p>
        <p><b>Data:</b> ${p.data_hora.substring(0, 16)}</p>
        <p><b>Organizador:</b> ${p.organizador}</p>
        <p><b>Tipo:</b> <span class='etiqueta ${p.tipo_acesso}'>${TIPOS_PARTIDA[p.tipo_acesso]}</span></p>
        <p><b>Situação:</b> <span class='etiqueta ${p.status_partida}'>${p.status_partida}</span></p>
        <p><b>Vagas:</b> ${p.max_jogadores - p.confirmados}</p>
        <p>${p.descricao || ''}</p>`;
    if (p.status_partida != 'cancelada' && (p.id_organizador == usuario.id_usuario || usuario.admin == 1)) {
        html += `<a href='partida_alterar.html?id=${id}'>Alterar</a>
                 <a href='#' class='perigo' onclick='cancelar()'>Cancelar partida</a>`;
    }
    document.getElementById('partida').innerHTML = html;
}

function mostrarJogadores(jogadores, partida) {
    const organizador = partida.id_organizador == usuario.id_usuario || usuario.admin == 1;
    const cancelada   = partida.status_partida == 'cancelada';
    let html = `<table><tr><th>Jogador</th><th>Posição</th><th>Situação</th><th>#</th></tr>`;
    let situacao = null;
    for (const j of jogadores) {
        let botoes = '';
        if (organizador && !cancelada && j.status_participacao == 'pendente') {
            botoes = `<a href='#' onclick="validarEntrada(${j.id_jogador}, 'confirmado')">Aprovar</a>
                      <a href='#' class='perigo' onclick="validarEntrada(${j.id_jogador}, 'recusado')">Recusar</a>`;
        }
        html += `
            <tr>
                <td>${j.nome}</td>
                <td>${j.posicao || ''}</td>
                <td><span class='etiqueta ${j.status_participacao}'>${j.status_participacao}</span></td>
                <td>${botoes}</td>
            </tr>`;
        if (j.eu == 1) {
            situacao = j.status_participacao;
        }
    }
    html += '</table>';
    document.getElementById('jogadores').innerHTML = html;

    const semVagas = partida.confirmados >= partida.max_jogadores;
    document.getElementById('acoes').hidden = cancelada || situacao == 'recusado' || (semVagas && situacao == null);
    document.getElementById('convite').hidden = !organizador || cancelada || partida.tipo_acesso == 'publica';

    const entrar = document.getElementById('entrar');
    const sair   = document.getElementById('sair');
    entrar.hidden = situacao == 'confirmado' || situacao == 'pendente';
    sair.hidden   = situacao == null;
    document.getElementById('alterar').hidden = situacao != 'confirmado';

    entrar.textContent = 'Entrar na partida';
    sair.textContent   = 'Sair da partida';
    if (situacao == 'convidado') {
        entrar.textContent = 'Aceitar convite';
        sair.textContent   = 'Recusar convite';
    } else if (situacao == 'pendente') {
        sair.textContent = 'Cancelar pedido';
    } else if (partida.tipo_acesso == 'privada_visivel' && !organizador) {
        entrar.textContent = 'Pedir para entrar';
    }
}

async function validarEntrada(idJogador, status) {
    const fd = new FormData();
    fd.append('id_partida', id);
    fd.append('id_jogador', idJogador);
    fd.append('status',     status);

    const retorno  = await fetch('../php/escalacao_validar.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    buscar();
}

document.getElementById('convidar').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('id_partida', id);
    fd.append('email',      document.getElementById('email_convite').value);

    const retorno  = await fetch('../php/escalacao_convidar.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        document.getElementById('email_convite').value = '';
    }
    buscar();
});

document.getElementById('entrar').addEventListener('click', () => {
    enviar('../php/escalacao_novo.php');
});

document.getElementById('alterar').addEventListener('click', () => {
    enviar('../php/escalacao_alterar.php');
});

async function enviar(arquivo) {
    const fd = new FormData();
    fd.append('id_partida', id);
    fd.append('posicao',    document.getElementById('posicao').value);

    const retorno  = await fetch(arquivo, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    buscar();
}

document.getElementById('sair').addEventListener('click', async () => {
    const retorno  = await fetch('../php/escalacao_excluir.php?id_partida=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    buscar();
});

async function cancelar() {
    const retorno  = await fetch('../php/partida_excluir.php?id=' + id);
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    buscar();
}
