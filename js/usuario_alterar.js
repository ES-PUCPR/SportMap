// Fase 1
document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    const url = new URLSearchParams(window.location.search);
    const id  = url.get('id');
    buscar(id);
});

async function buscar(id) {
    const retorno  = await fetch('../php/usuario_get.php?id=' + id);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        document.getElementById('nome').value     = reg.nome;
        document.getElementById('cpf').value      = reg.cpf;
        document.getElementById('email').value    = reg.email;
        document.getElementById('telefone').value = reg.telefone;
        document.getElementById('posicao').value  = reg.posicao || '';
        document.getElementById('id').value       = id;
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
    fd.append('nome',     document.getElementById('nome').value);
    fd.append('email',    document.getElementById('email').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('posicao',  document.getElementById('posicao').value);
    fd.append('senha',    document.getElementById('senha').value);

    const retorno  = await fetch('../php/usuario_alterar.php?id=' + id, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = '../home/';
    }
}
