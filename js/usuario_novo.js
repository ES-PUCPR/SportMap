document.getElementById('enviar').addEventListener('click', () => {
    novo();
});

async function novo() {
    const fd = new FormData();
    fd.append('nome',     document.getElementById('nome').value);
    fd.append('cpf',      document.getElementById('cpf').value);
    fd.append('email',    document.getElementById('email').value);
    fd.append('telefone', document.getElementById('telefone').value);
    fd.append('posicao',  document.getElementById('posicao').value);
    fd.append('senha',    document.getElementById('senha').value);
    if (document.getElementById('dono_quadra').checked) {
        fd.append('dono_quadra', '1');
    }

    const retorno  = await fetch('../php/usuario_novo.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'index.html';
    }
}
