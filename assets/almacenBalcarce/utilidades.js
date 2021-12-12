function convertirObjetoATexto(obj){
    return JSON.stringify(obj);
}

/* Tres funciones guardar, leer y eliminar*/

function guardarStorage(clave, valor){
    localStorage.setItem(clave, convertirObjetoATexto(valor));
}
/*
guardarStorage( "ultimoAcceso", "25/10/2021");
 */

function leerStorage(clave){
    let valor= localStorage.getItem(clave);
    console.log(valor);
    return JSON.parse(valor);
}
function eliminarStorage(clave){
    let valor= localStorage.removeItem(clave);
}

function convertirTextoAobjetos(texto){
    return JSON.parse(texto);
}

guardarStorage("clave", "valor");
leerStorage("ultimoAcceso");
eliminarStorage("clave");




