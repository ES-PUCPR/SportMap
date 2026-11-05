document.getElementById("form").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const resposta = await postar("usuario_login.php", new FormData(evento.target));
    if (resposta.status === "ok") {
        window.location.href = "../home/index_CHA.html";
    } else {
        aviso(resposta.mensagem);
    }
});

document.addEventListener("DOMContentLoaded", mostrarAvisoGuardado);
