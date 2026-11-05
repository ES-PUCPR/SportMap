// Tema e idioma. Carregado no <head> para aplicar as preferências antes da primeira renderização.
// Persistência em localStorage (chaves "tema" e "idioma").
//
// Tradução: o texto-fonte é o português. Um MutationObserver percorre os nós adicionados à página e
// substitui textos e atributos conforme os dicionários TEXTOS e PADROES de js/idioma_textos.js.

const IDIOMAS = {
    pt: { nome: "Português", local: "pt-BR", coluna: -1 },
    en: { nome: "English", local: "en", coluna: 0 },
    es: { nome: "Español", local: "es", coluna: 1 }
};

function lerPreferencia(chave) {
    try { return localStorage.getItem(chave); } catch (erro) { return null; }
}

function salvarPreferencia(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (erro) { /* vale só até recarregar a página */ }
}

// ---------- Modo escuro ----------

function temaInicial() {
    const salvo = lerPreferencia("tema");
    if (salvo === "claro" || salvo === "escuro") {
        return salvo;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

let temaAtual = temaInicial();
document.documentElement.dataset.tema = temaAtual;

// ---------- Idioma ----------

let idiomaAtual = lerPreferencia("idioma");
if (!Object.hasOwn(IDIOMAS, idiomaAtual ?? "")) {
    idiomaAtual = "pt";
}
document.documentElement.lang = IDIOMAS[idiomaAtual].local;

function localAtual() {
    return IDIOMAS[idiomaAtual].local;
}

function traducaoExata(texto) {
    return Object.hasOwn(TEXTOS, texto) ? TEXTOS[texto][IDIOMAS[idiomaAtual].coluna] : null;
}

// Traduz um trecho variável de uma frase. Listas ("quadra, data") são traduzidas item por item.
function traduzirTrecho(trecho) {
    const exata = traducaoExata(trecho);
    if (exata !== null) {
        return exata;
    }
    return trecho.split(", ").map((parte) => traducaoExata(parte) ?? parte).join(", ");
}

function traduzir(texto) {
    if (idiomaAtual === "pt" || !texto) {
        return texto;
    }
    const limpo = texto.trim();
    if (!limpo) {
        return texto;
    }
    let resultado = traducaoExata(limpo);
    if (resultado === null) {
        for (const padrao of PADROES) {
            const achado = limpo.match(padrao[0]);
            if (achado) {
                resultado = padrao[IDIOMAS[idiomaAtual].coluna + 1]
                    .replace(/\$(\d)/g, (_, n) => traduzirTrecho(achado[Number(n)]));
                break;
            }
        }
    }
    return resultado === null ? texto : texto.replace(limpo, () => resultado);
}

const ATRIBUTOS_TRADUZIDOS = ["placeholder", "title", "aria-label"];

function traduzirNo(no) {
    if (no.nodeType === Node.TEXT_NODE) {
        const pai = no.parentNode ? no.parentNode.nodeName : "";
        if (pai !== "SCRIPT" && pai !== "STYLE" && pai !== "TEXTAREA") {
            const novo = traduzir(no.nodeValue);
            if (novo !== no.nodeValue) {
                no.nodeValue = novo;
            }
        }
    } else if (no.nodeType === Node.ELEMENT_NODE) {
        for (const atributo of ATRIBUTOS_TRADUZIDOS) {
            if (no.hasAttribute(atributo)) {
                no.setAttribute(atributo, traduzir(no.getAttribute(atributo)));
            }
        }
        no.childNodes.forEach(traduzirNo);
    }
}

if (idiomaAtual !== "pt") {
    // Conteúdo novo (listas vindas do PHP, avisos, menus) é traduzido assim que entra na página.
    new MutationObserver((mudancas) => {
        for (const mudanca of mudancas) {
            mudanca.addedNodes.forEach(traduzirNo);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
    traduzirNo(document.documentElement);

    const confirmarOriginal = window.confirm.bind(window);
    const perguntarOriginal = window.prompt.bind(window);
    window.confirm = (mensagem) => confirmarOriginal(traduzir(mensagem));
    window.prompt = (mensagem, padrao) => perguntarOriginal(traduzir(mensagem), padrao);
}

// ---------- Controles na tela ----------

function textoBotaoTema() {
    return temaAtual === "escuro" ? "Modo claro" : "Modo escuro";
}

// Coloca os controles dentro de "alvo", antes do elemento "antesDe" (ou no fim).
function inserirPreferencias(alvo, antesDe = null) {
    const grupo = document.createElement("div");
    grupo.className = "preferencias";
    grupo.setAttribute("role", "group");
    grupo.setAttribute("aria-label", "Acessibilidade");

    const rotulo = document.createElement("label");
    const nomeRotulo = document.createElement("span");
    nomeRotulo.textContent = "Idioma";
    const seletor = document.createElement("select");
    for (const [codigo, idioma] of Object.entries(IDIOMAS)) {
        seletor.add(new Option(idioma.nome, codigo, false, codigo === idiomaAtual));
    }
    seletor.addEventListener("change", () => {
        salvarPreferencia("idioma", seletor.value);
        window.location.reload();
    });
    rotulo.append(nomeRotulo, seletor);

    const botaoTema = document.createElement("button");
    botaoTema.type = "button";
    botaoTema.className = "botao-tema";
    botaoTema.textContent = textoBotaoTema();
    botaoTema.addEventListener("click", () => {
        temaAtual = temaAtual === "escuro" ? "claro" : "escuro";
        document.documentElement.dataset.tema = temaAtual;
        salvarPreferencia("tema", temaAtual);
        botaoTema.textContent = textoBotaoTema();
    });

    grupo.append(rotulo, botaoTema);
    alvo.insertBefore(grupo, antesDe);
}

// Nas telas de login os controles entram no topo da caixa. Nas demais, montarTopo() os coloca no menu.
document.addEventListener("DOMContentLoaded", () => {
    const caixa = document.querySelector(".caixa-login");
    if (caixa) {
        inserirPreferencias(caixa, caixa.firstElementChild);
    }
});
