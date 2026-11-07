// Sugere endereços durante a digitação, com o serviço Photon (dados do OpenStreetMap).
function ligarEndereco(idCampo, aoEscolher) {
    const campo = document.getElementById(idCampo);
    const lista = document.createElement('datalist');
    let sugestoes = [];
    let espera = null;

    lista.id = idCampo + '_lista';
    campo.setAttribute('list', lista.id);
    campo.after(lista);

    campo.addEventListener('input', () => {
        const escolhida = sugestoes.find((s) => s.endereco == campo.value);
        aoEscolher(escolhida);
        clearTimeout(espera);
        if (!escolhida && campo.value.length >= 3) {
            espera = setTimeout(buscarSugestoes, 400);
        }
    });

    async function buscarSugestoes() {
        const texto    = campo.value;
        const retorno  = await fetch('https://photon.komoot.io/api/?limit=5&bbox=-74,-34,-34,6&q=' + encodeURIComponent(texto));
        const resposta = await retorno.json();

        // Mantém o número digitado, que muitas ruas do mapa não têm cadastrado
        const numero = texto.match(/,\s*(\d+)/);

        let html = '';
        sugestoes = [];
        for (const f of resposta.features) {
            const p = f.properties;
            const partes = [p.name, p.street, numero ? numero[1] : '', p.district, p.city, p.state];
            const endereco = partes.filter((parte) => parte).join(', ');
            sugestoes.push({
                endereco:  endereco,
                latitude:  f.geometry.coordinates[1],
                longitude: f.geometry.coordinates[0]
            });
            html += `<option value='${endereco}'></option>`;
        }
        lista.innerHTML = html;
    }
}
