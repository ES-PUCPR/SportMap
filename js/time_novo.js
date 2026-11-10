document.addEventListener('DOMContentLoaded', () => {
    validaSessao();
});

document.getElementById('enviar').addEventListener('click', novo);

async function novo() {
    const fd = new FormData();
    fd.append('nome',      document.getElementById('nome').value);
    fd.append('sigla',     document.getElementById('sigla').value);
    fd.append('cidade',    document.getElementById('cidade').value);
    fd.append('descricao', document.getElementById('descricao').value);

    const retorno  = await fetch('../php/time_novo.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'time.html';
    }
}
