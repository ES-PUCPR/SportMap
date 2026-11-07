let mapa = null;
let marcadores = null;

document.addEventListener('DOMContentLoaded', () => {
    valida_sessao();

    mapa = L.map('mapa').setView([-15.78, -47.93], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(mapa);
    marcadores = L.layerGroup().addTo(mapa);

    ligarEndereco('endereco', (sugestao) => {
        if (sugestao) {
            buscar(sugestao.latitude, sugestao.longitude);
        }
    });
});

document.getElementById('gps').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        (posicao) => buscar(posicao.coords.latitude, posicao.coords.longitude),
        () => alert('Não foi possível obter sua localização. Digite um endereço.')
    );
});

async function buscar(lat, lng) {
    const retorno  = await fetch('../php/quadra_proximas.php?lat=' + lat + '&lng=' + lng);
    const resposta = await retorno.json();
    mostrarMapa(lat, lng, resposta.data);
    mostrarLista(resposta.data);
}

function mostrarMapa(lat, lng, quadras) {
    marcadores.clearLayers();
    L.circleMarker([lat, lng]).addTo(marcadores);
    const pontos = [[lat, lng]];
    for (const q of quadras) {
        pontos.push([q.latitude, q.longitude]);
        L.marker([q.latitude, q.longitude]).bindPopup(q.nome_quadra).addTo(marcadores);
    }
    mapa.fitBounds(pontos, { padding: [40, 40], maxZoom: 15, animate: false });
}

function mostrarLista(quadras) {
    let html = '';
    for (const q of quadras) {
        html += `
            <div class='caixa'>
                <h3>${q.nome_quadra}</h3>
                <p>${q.endereco}</p>
                <p><b>Distância:</b> ${Number(q.distancia).toFixed(1)} km</p>
                <a href='index.html?local=${encodeURIComponent(q.nome_quadra)}'>Ver partidas</a>
            </div>`;
    }
    if (quadras.length == 0) {
        html = '<p>Nenhuma quadra encontrada.</p>';
    }
    document.getElementById('lista').innerHTML = html;
}
