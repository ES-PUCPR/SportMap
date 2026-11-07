document.documentElement.dataset.tema = localStorage.getItem('tema') || 'claro';

function atualizarBotaoTema() {
    const escuro = document.documentElement.dataset.tema == 'escuro';
    document.getElementById('tema').textContent = escuro ? 'Modo claro' : 'Modo escuro';
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarBotaoTema();
    document.getElementById('tema').addEventListener('click', () => {
        const novo = document.documentElement.dataset.tema == 'escuro' ? 'claro' : 'escuro';
        document.documentElement.dataset.tema = novo;
        localStorage.setItem('tema', novo);
        atualizarBotaoTema();
    });
});
