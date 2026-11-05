// Funções usadas por todas as páginas. Este arquivo é carregado antes do script de cada tela.

let usuarioAtual = null;

// Protege o texto vindo do banco antes de colocá-lo no HTML.
function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

async function pegar(arquivo) {
    try {
        const retorno = await fetch("../php/" + arquivo);
        return await retorno.json();
    } catch (erro) {
        return { status: "nok", mensagem: "Não foi possível falar com o servidor.", data: [] };
    }
}

async function postar(arquivo, dados) {
    try {
        const retorno = await fetch("../php/" + arquivo, { method: "POST", body: dados || new FormData() });
        return await retorno.json();
    } catch (erro) {
        return { status: "nok", mensagem: "Não foi possível falar com o servidor.", data: [] };
    }
}

// Mostra uma mensagem na caixa #aviso da página.
function aviso(mensagem, tipo = "erro") {
    const caixa = document.getElementById("aviso");
    caixa.className = "aviso aviso-" + tipo;
    caixa.textContent = mensagem;
    caixa.scrollIntoView({ block: "nearest" });
}

// Guarda uma mensagem de sucesso para exibir na próxima página.
function irComAviso(url, mensagem) {
    try { sessionStorage.setItem("aviso", mensagem); } catch (erro) { /* a navegação segue sem o aviso */ }
    window.location.href = url;
}

function mostrarAvisoGuardado() {
    try {
        const mensagem = sessionStorage.getItem("aviso");
        if (mensagem) {
            sessionStorage.removeItem("aviso");
            aviso(mensagem, "ok");
        }
    } catch (erro) { /* sem armazenamento, sem aviso */ }
}

function temPerfil(perfil) {
    return usuarioAtual && usuarioAtual.perfis.includes(perfil);
}

function ehAdmin() {
    return temPerfil("superadmin");
}

function dataBR(valor) {
    return new Date(valor.replace(" ", "T")).toLocaleDateString(localAtual(), {
        weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"
    });
}

function hora(valor) {
    return String(valor || "").substring(0, 5);
}

function pegarId() {
    return new URLSearchParams(window.location.search).get("id");
}

function montarTopo() {
    const links = [["index_CHA.html", "Partidas"], ["perto_EDW.html", "Perto de mim"]];
    if (temPerfil("dono_quadra") || ehAdmin()) {
        links.push(["quadra_EDW.html", "Quadras"]);
    }
    links.push(["time_PED.html", "Times"]);
    if (ehAdmin()) {
        links.push(["usuario_LEO.html", "Usuários"]);
    }
    links.push(["usuario_alterar_LEO.html?id=" + usuarioAtual.id_usuario, "Meu perfil"]);

    const atual = window.location.pathname.split("/").pop() || "index_CHA.html";
    const itens = links.map(([url, nome]) => {
        const ativo = url.split("?")[0] === atual ? ' aria-current="page"' : "";
        return `<a href="${url}"${ativo}>${esc(nome)}</a>`;
    }).join("");

    document.getElementById("topo").innerHTML = `
        <a class="marca" href="index_CHA.html">Sport<span>Map</span></a>
        <nav aria-label="Principal">${itens}</nav>
        <button type="button" class="botao-sair" id="sair">Sair</button>`;
    inserirPreferencias(document.getElementById("topo"), document.getElementById("sair"));

    document.getElementById("sair").addEventListener("click", async () => {
        await postar("usuario_logoff.php");
        window.location.href = "../login/";
    });
}

// Toda página interna chama esta função primeiro. Sem sessão, volta para o login.
async function valida_sessao() {
    const resposta = await pegar("valida_sessao.php");
    if (resposta.status !== "ok") {
        window.location.href = "../login/";
        return null;
    }
    usuarioAtual = resposta.data;
    montarTopo();
    mostrarAvisoGuardado();
    return usuarioAtual;
}
