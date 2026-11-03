document.getElementById('btn_add').addEventListener("click", () => {
    let nome_quadra = document.getElementById("nome_quadra").value;
    let endereco = document.getElementById("endereco").value;
    let responsavel = document.getElementById("responsavel").value;
    let preco_hora = document.getElementById("preco_hora").value;
    let tipo_quadra = document.getElementById("tipo_quadra").value;

    let lista = JSON.parse(localStorage.getItem("lista_local"));
    if(!lista){ lista = [];}

    lista.push({nome_quadra: nome_quadra, endereco: endereco, 
        responsavel: responsavel, 
        preco_hora: preco_hora, tipo_quadra: tipo_quadra});

    localStorage.setItem("lista_local", JSON.stringify(lista));

    document.getElementById("nome_quadra").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("responsavel").value = "";
    document.getElementById("preco_hora").value = "";
    document.getElementById("tipo_quadra").value = "";

    listar();
});


function listar(){
    let lista = JSON.parse(localStorage.getItem("lista_local"));

    if(!lista){lista=[];}

    document.getElementById("t_add").innerHTML = "";

    let indice = 0;
    for(let item of lista){
        document.getElementById("t_add").innerHTML += `
        <tr>
            <td>${item.nome_quadra}</td>
            <td>${item.endereco}</td>
            <td>${item.responsavel}</td>
            <td>R$${item.preco_hora}</td>
            <td>${item.tipo_quadra}</td>
            <td>
                <button onclick="del(${indice})">Delete</button>
                <button onclick="load(${indice})">Edit</button>
            </td>
        </tr>`;
        indice++;
    }
}

function del(indice){
    let lista = JSON.parse(localStorage.getItem("lista_local"));
    lista.splice(indice, 1);
    localStorage.setItem("lista_local", JSON.stringify(lista));
    listar();
}

function load(indice){
    let lista = JSON.parse(localStorage.getItem("lista_local"));

    document.getElementById("nome_quadra").value = lista[indice].nome_quadra;
    document.getElementById("endereco").value = lista[indice].endereco;
    document.getElementById("responsavel").value = lista[indice].responsavel;
    document.getElementById("preco_hora").value = lista[indice].preco_hora;
    document.getElementById("tipo_quadra").value = lista[indice].tipo_quadra;

    document.getElementById("btn_add").style.display="none";
    document.getElementById("edit").innerHTML = `<button onclick=edit(${indice})>Edit</button>`;
}

function edit(indice){
    let lista = JSON.parse(localStorage.getItem("lista_local"));

    lista[indice].nome_quadra = document.getElementById("nome_quadra").value;
    lista[indice].endereco = document.getElementById("endereco").value;
    lista[indice].responsavel = document.getElementById("responsavel").value;
    lista[indice].preco_hora = document.getElementById("preco_hora").value;
    lista[indice].tipo_quadra = document.getElementById("tipo_quadra").value;

    localStorage.setItem("lista_local", JSON.stringify(lista));

    document.getElementById("nome_quadra").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("responsavel").value = "";
    document.getElementById("preco_hora").value = "";
    document.getElementById("tipo_quadra").value = "";

    document.getElementById("edit").innerHTML = "";
    document.getElementById("btn_add").style.display = "inline-block";

    listar();
}

listar();