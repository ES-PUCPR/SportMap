document.getElementById('btn_add').addEventListener("click", () => {
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let idade = document.getElementById("idade").value;
    let endereco = document.getElementById("endereco").value;
    let telefone = document.getElementById("telefone").value;

    let lista = JSON.parse(localStorage.getItem("lista_jogador"));
    if(!lista){ lista = [];}

    lista.push({nome: nome, email: email, idade: idade,
        endereco: endereco, telefone: telefone
    });

    localStorage.setItem("lista_jogador", JSON.stringify(lista));

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("telefone").value = "";

    listar();
});


function listar(){
    let lista = JSON.parse(localStorage.getItem("lista_jogador"));

    if(!lista){lista=[];}

    document.getElementById("t_add").innerHTML = "";

    let indice = 0;
    for(let item of lista){
        document.getElementById("t_add").innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.idade}</td>
            <td>${item.endereco}</td>
            <td>${item.telefone}</td>
            <td>
                <button onclick="del(${indice})">Delete</button>
                <button onclick="load(${indice})">Edit</button>
            </td>
        </tr>`;
        indice++;
    }
}

function del(indice){
    let lista = JSON.parse(localStorage.getItem("lista_jogador"));
    lista.splice(indice, 1);
    localStorage.setItem("lista_jogador", JSON.stringify(lista));
    listar();
}

function load(indice){
    let lista = JSON.parse(localStorage.getItem("lista_jogador"));

    document.getElementById("nome").value = lista[indice].nome;
    document.getElementById("email").value = lista[indice].email;
    document.getElementById("idade").value = lista[indice].idade;
    document.getElementById("endereco").value = lista[indice].endereco;
    document.getElementById("telefone").value = lista[indice].telefone;

    document.getElementById("btn_add").style.display="none";
    document.getElementById("edit").innerHTML = `<button onclick=edit(${indice})>Edit</button>`;
}

function edit(indice){
    let lista = JSON.parse(localStorage.getItem("lista_jogador"));

    lista[indice].nome = document.getElementById("nome").value;
    lista[indice].email = document.getElementById("email").value;
    lista[indice].idade = document.getElementById("idade").value;
    lista[indice].endereco = document.getElementById("endereco").value;
    lista[indice].telefone = document.getElementById("telefone").value;

    localStorage.setItem("lista_jogador", JSON.stringify(lista));

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("telefone").value = "";

    document.getElementById("edit").innerHTML = "";
    document.getElementById("btn_add").style.display = "inline-block";

    listar();
}

listar();