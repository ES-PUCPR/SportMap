document.getElementById('btn_add').addEventListener("click", () => {
    let horario = document.getElementById("horario").value;
    let nome_lobby = document.getElementById("nome_lobby").value;
    let local = document.getElementById("local").value;
    let qnt_pessoas = document.getElementById("qnt_pessoas").value;

    let lista = JSON.parse(localStorage.getItem("lista_lobby"));
    if(!lista){ lista = [];}

    lista.push({horario: horario, nome_lobby: nome_lobby, local: local, qnt: qnt_pessoas});

    localStorage.setItem("lista_lobby", JSON.stringify(lista));

    document.getElementById("horario").value = "";
    document.getElementById("nome_lobby").value = "";
    document.getElementById("local").value = "";
    document.getElementById("qnt_pessoas").value = "";

    listar();

});


function listar(){
    let lista = JSON.parse(localStorage.getItem("lista_lobby"));

    if(!lista){lista=[];}

    document.getElementById("t_add").innerHTML = "";

    let indice = 0;
    for(let item of lista){
        document.getElementById("t_add").innerHTML += `
        <tr>
            <td>${item.horario}</td>
            <td>${item.nome_lobby}</td>
            <td>${item.local}</td>
            <td>${item.qnt}</td>
            <td>
                <button onclick="del(${indice})">Delete</button>
                <button onclick="load(${indice})">Edit</button>
            </td>
        </tr>`;
        indice++;
    }
}

function del(indice){
    let lista = JSON.parse(localStorage.getItem("lista_lobby"));
    lista.splice(indice, 1);
    localStorage.setItem("lista_lobby", JSON.stringify(lista));
    listar();
}

function load(indice){
    let lista = JSON.parse(localStorage.getItem("lista_lobby"));

    document.getElementById("horario").value = lista[indice].horario;
    document.getElementById("nome_lobby").value = lista[indice].nome_lobby;
    document.getElementById("local").value = lista[indice].local;
    document.getElementById("qnt_pessoas").value = lista[indice].qnt;

    document.getElementById("btn_add").style.display="none";
    document.getElementById("edit").innerHTML = `<button onclick=edit(${indice})>Edit</button>`;
}

function edit(indice){
    let lista = JSON.parse(localStorage.getItem("lista_lobby"));

    lista[indice].horario = document.getElementById("horario").value;
    lista[indice].nome_lobby = document.getElementById("nome_lobby").value;
    lista[indice].local = document.getElementById("local").value;
    lista[indice].qnt = document.getElementById("qnt_pessoas").value;

    localStorage.setItem("lista_lobby", JSON.stringify(lista));

    document.getElementById("horario").value = "";
    document.getElementById("nome_lobby").value = "";
    document.getElementById("local").value = "";
    document.getElementById("qnt_pessoas").value = "";

    document.getElementById("edit").innerHTML = "";
    document.getElementById("btn_add").style.display = "inline-block";

    listar();
}

listar();