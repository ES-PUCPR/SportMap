document.addEventListener('DOMContentLoaded', () => {
    validaSessao();
    carregarOpcoes();
});

document.getElementById('enviar').addEventListener('click', novo);

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
