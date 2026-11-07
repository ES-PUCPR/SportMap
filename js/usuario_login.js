document.getElementById('enviar').addEventListener('click', () => {
    login();
});

async function login() {
    const fd = new FormData();
    fd.append('email', document.getElementById('email').value);
    fd.append('senha', document.getElementById('senha').value);

    const retorno  = await fetch('../php/usuario_login.php', {
        method: 'POST',
        body:   fd
    });
    const resposta = await retorno.json();
    if (resposta.status == 'ok') {
        window.location.href = '../home/';
    } else {
        alert(resposta.mensagem);
    }
}
