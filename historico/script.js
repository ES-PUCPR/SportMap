document.getElementById('btn_add').addEventListener("click", () => {
    let time1 = document.getElementById("time1").value;
    let time2 = document.getElementById("time2").value;
    let dia = document.getElementById("dia").value;
    let hora = document.getElementById("hora").value;
    let placar = document.getElementById("placar").value;
    let vencedor = document.getElementById("vencedor").value;
    let local = document.getElementById("local").value;

    let lista = JSON.parse(localStorage.getItem("lista_historico"));
    if(!lista){ lista = [];}

    lista.push({time1: time1, time2: time2, dia: dia, 
        hora: hora, placar: placar,
        vencedor: vencedor, local: local
    });

    localStorage.setItem("lista_historico", JSON.stringify(lista));

    document.getElementById("time1").value = "";
    document.getElementById("time2").value = "";
    document.getElementById("dia").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("placar").value = "";
    document.getElementById("vencedor").value = "";
    document.getElementById("local").value = "";

    listar();
});


function listar(){
    let lista = JSON.parse(localStorage.getItem("lista_historico"));

    if(!lista){lista=[];}

    document.getElementById("t_add").innerHTML = "";

    let indice = 0;
    for(let item of lista){
        document.getElementById("t_add").innerHTML += `
        <tr>
            <td>${item.time1}</td>
            <td>${item.time2}</td>
            <td>${item.dia}</td>
            <td>${item.hora}</td>
            <td>${item.placar}</td>
            <td>${item.vencedor}</td>
            <td>${item.local}</td>
            <td>
                <button onclick="del(${indice})">Delete</button>
                <button onclick="load(${indice})">Edit</button>
            </td>
        </tr>`;
        indice++;
    }
}

function del(indice){
    let lista = JSON.parse(localStorage.getItem("lista_historico"));
    lista.splice(indice, 1);
    localStorage.setItem("lista_historico", JSON.stringify(lista));
    listar();
}

function load(indice){
    let lista = JSON.parse(localStorage.getItem("lista_historico"));

    document.getElementById("time1").value = lista[indice].time1;
    document.getElementById("time2").value = lista[indice].time2;
    document.getElementById("dia").value = lista[indice].dia;
    document.getElementById("hora").value = lista[indice].hora;
    document.getElementById("placar").value = lista[indice].placar;
    document.getElementById("vencedor").value = lista[indice].vencedor;
    document.getElementById("local").value = lista[indice].local;

    document.getElementById("btn_add").style.display="none";
    document.getElementById("edit").innerHTML = `<button onclick=edit(${indice})>Edit</button>`;
}

function edit(indice){
    let lista = JSON.parse(localStorage.getItem("lista_historico"));

    lista[indice].time1 = document.getElementById("time1").value;
    lista[indice].time2 = document.getElementById("time2").value;
    lista[indice].dia = document.getElementById("dia").value;
    lista[indice].hora = document.getElementById("hora").value;
    lista[indice].placar = document.getElementById("placar").value;
    lista[indice].vencedor = document.getElementById("vencedor").value;
    lista[indice].local = document.getElementById("local").value;

    localStorage.setItem("lista_historico", JSON.stringify(lista));

    document.getElementById("time1").value = "";
    document.getElementById("time2").value = "";
    document.getElementById("dia").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("placar").value = "";
    document.getElementById("vencedor").value = "";
    document.getElementById("local").value = "";

    document.getElementById("edit").innerHTML = "";
    document.getElementById("btn_add").style.display = "inline-block";

    listar();
}

listar();