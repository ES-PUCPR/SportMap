// Fase 1
document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    const url = new URLSearchParams(window.location.search);
    const id  = url.get('id');
    buscar(id);
});

async function buscar(id) {
    const retorno  = await fetch('../php/time_get.php?id=' + id);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        document.getElementById('nome').value      = reg.nome;
        document.getElementById('sigla').value     = reg.sigla;
        document.getElementById('cidade').value    = reg.cidade;
        document.getElementById('descricao').value = reg.descricao;
        document.getElementById('id').value        = id;
    } else {
        alert(resposta.mensagem);
        window.location.href = 'time.html';
    }
}

// Fase 2
document.getElementById('enviar').addEventListener('click', () => {
    alterar();
});

async function alterar() {
    const id = document.getElementById('id').value;
    const fd = new FormData();
    fd.append('nome',      document.getElementById('nome').value);
    fd.append('sigla',     document.getElementById('sigla').value);
    fd.append('cidade',    document.getElementById('cidade').value);
    fd.append('descricao', document.getElementById('descricao').value);

    const retorno  = await fetch('../php/time_alterar.php?id=' + id, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'time.html';
    }
}
