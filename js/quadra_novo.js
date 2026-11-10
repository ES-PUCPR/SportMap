document.addEventListener('DOMContentLoaded', () => {
    validaSessao();
    ligarEndereco('endereco', (sugestao) => {
        document.getElementById('latitude').value  = sugestao ? sugestao.latitude : '';
        document.getElementById('longitude').value = sugestao ? sugestao.longitude : '';
    });
});

document.getElementById('enviar').addEventListener('click', novo);

async function novo() {
    const fd = new FormData();
    fd.append('nome_quadra', document.getElementById('nome_quadra').value);
    fd.append('endereco',    document.getElementById('endereco').value);
    fd.append('tipo_quadra', document.getElementById('tipo_quadra').value);
    fd.append('latitude',    document.getElementById('latitude').value);
    fd.append('longitude',   document.getElementById('longitude').value);

    const retorno  = await fetch('../php/quadra_novo.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'quadra.html';
    }
}
