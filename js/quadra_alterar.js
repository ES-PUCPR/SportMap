// Fase 1
document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();
    const url = new URLSearchParams(window.location.search);
    const id  = url.get('id');
    buscar(id);

    ligarEndereco('endereco', (sugestao) => {
        document.getElementById('latitude').value  = sugestao ? sugestao.latitude : '';
        document.getElementById('longitude').value = sugestao ? sugestao.longitude : '';
    });
});

async function buscar(id) {
    const retorno  = await fetch('../php/quadra_get.php?id=' + id);
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        const reg = resposta.data[0];
        document.getElementById('nome_quadra').value = reg.nome_quadra;
        document.getElementById('endereco').value    = reg.endereco;
        document.getElementById('tipo_quadra').value = reg.tipo_quadra;
        document.getElementById('latitude').value    = reg.latitude;
        document.getElementById('longitude').value   = reg.longitude;
        document.getElementById('id').value          = id;
    } else {
        alert(resposta.mensagem);
        window.location.href = 'quadra.html';
    }
}

// Fase 2
document.getElementById('enviar').addEventListener('click', () => {
    alterar();
});

async function alterar() {
    const id = document.getElementById('id').value;
    const fd = new FormData();
    fd.append('nome_quadra', document.getElementById('nome_quadra').value);
    fd.append('endereco',    document.getElementById('endereco').value);
    fd.append('tipo_quadra', document.getElementById('tipo_quadra').value);
    fd.append('latitude',    document.getElementById('latitude').value);
    fd.append('longitude',   document.getElementById('longitude').value);

    const retorno  = await fetch('../php/quadra_alterar.php?id=' + id, {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    alert(resposta.mensagem);
    if (resposta.status == 'ok') {
        window.location.href = 'quadra.html';
    }
}
