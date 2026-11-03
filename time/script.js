document.getElementById('btn_add').addEventListener("click", () => {
    let nome_time = document.getElementById("nome_time").value;
    let modalidade = document.getElementById("modalidade").value;
    let capitao = document.getElementById("capitao").value;
    let qnt_jogadores = document.getElementById("qnt_jogadores").value;
    let cidade = document.getElementById("cidade").value;

    let lista = JSON.parse(localStorage.getItem("lista_time"));
    if(!lista){ lista = [];}

    lista.push({nome_time: nome_time, modalidade: modalidade,
        capitao: capitao, qnt_jogadores: qnt_jogadores, cidade: cidade
    });

    localStorage.setItem("lista_time", JSON.stringify(lista));

    document.getElementById("nome_time").value = "";
    document.getElementById("modalidade").value = "";
    document.getElementById("capitao").value = "";
    document.getElementById("qnt_jogadores").value = "";
    document.getElementById("cidade").value = "";

    listar();
});


function listar(){
    let lista = JSON.parse(localStorage.getItem("lista_time"));

    if(!lista){lista=[];}

    document.getElementById("t_add").innerHTML = "";

    let indice = 0;
    for(let item of lista){
        document.getElementById("t_add").innerHTML += `
        <tr>
            <td>${item.nome_time}</td>
            <td>${item.modalidade}</td>
            <td>${item.capitao}</td>
            <td>${item.qnt_jogadores}</td>
            <td>${item.cidade}</td>
            <td>
                <button onclick="del(${indice})">Delete</button>
                <button onclick="load(${indice})">Edit</button>
            </td>
        </tr>`;
        indice++;
    }
}

function del(indice){
    let lista = JSON.parse(localStorage.getItem("lista_time"));
    lista.splice(indice, 1);
    localStorage.setItem("lista_time", JSON.stringify(lista));
    listar();
}

function load(indice){
    let lista = JSON.parse(localStorage.getItem("lista_time"));

    document.getElementById("nome_time").value = lista[indice].nome_time;
    document.getElementById("modalidade").value = lista[indice].modalidade;
    document.getElementById("capitao").value = lista[indice].capitao;
    document.getElementById("qnt_jogadores").value = lista[indice].qnt_jogadores;
    document.getElementById("cidade").value = lista[indice].cidade;

    document.getElementById("btn_add").style.display="none";
    document.getElementById("edit").innerHTML = `<button onclick=edit(${indice})>Edit</button>`;
}

function edit(indice){
    let lista = JSON.parse(localStorage.getItem("lista_time"));

    lista[indice].nome_time = document.getElementById("nome_time").value;
    lista[indice].modalidade = document.getElementById("modalidade").value;
    lista[indice].capitao = document.getElementById("capitao").value;
    lista[indice].qnt_jogadores = document.getElementById("qnt_jogadores").value;
    lista[indice].cidade = document.getElementById("cidade").value;

    localStorage.setItem("lista_time", JSON.stringify(lista));

    document.getElementById("nome_time").value = "";
    document.getElementById("modalidade").value = "";
    document.getElementById("capitao").value = "";
    document.getElementById("qnt_jogadores").value = "";
    document.getElementById("cidade").value = "";

    document.getElementById("edit").innerHTML = "";
    document.getElementById("btn_add").style.display = "inline-block";

    listar();
}

listar();