const TIPOS_PARTIDA = {
    publica: 'Pública',
    privada_visivel: 'Privada visível',
    privada_convite: 'Privada por convite'
};

async function valida_sessao() {
    const retorno  = await fetch('../php/valida_sessao.php');
    const resposta = await retorno.json();
    if (resposta.status == 'nok') {
        window.location.href = '../login/';
    } else {
        montarMenu(resposta.data[0]);
    }
    return resposta.data[0];
}

function montarMenu(usuario) {
    let html = `<a class='marca' href='index.html'>Sport<span>Map</span></a> `;
    html += `<a href='index.html'>Partidas</a> <a href='mapa.html'>Mapa</a> `;
    if (usuario.dono == 1 || usuario.admin == 1) {
        html += `<a href='quadra.html'>Quadras</a> `;
    }
    html += `<a href='time.html'>Times</a> `;
    if (usuario.admin == 1) {
        html += `<a href='usuario.html'>Usuários</a> `;
    }
    html += `<a href='usuario_alterar.html?id=${usuario.id_usuario}'>Meu perfil</a> `;
    html += `<a href='#' onclick='logoff()'>Sair</a>`;
    document.getElementById('menu').innerHTML = html;
}

async function logoff() {
    const retorno  = await fetch('../php/usuario_logoff.php');
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        window.location.href = '../login/';
    }
}
