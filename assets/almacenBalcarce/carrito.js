/*definimos la variable global*/
var PRODUCTOHTML;
var productos;
var CARRITO;
var PRODUCTOCARRITO;

/* Esto se va  a ver al ingresar a la página*/

function ingreso() {
    let ubicacion = prompt("¿Sos de San Justo? SI / NO");

    if (ubicacion.toLowerCase() !== "si") {
        $("#productoOferta").fadeOut();
        return;
    }
    $("#loSentimos").fadeOut();
    let edad = parseInt(prompt("Ingresa tu edad"));
    if (edad < 18) {
        alert("No podrás comprar bebidas alcoholicas");
    }
}

ingreso();

/*Funciones en el carrito*/
function validarDatos() {
    const nombre = document.getElementById("nombreApellido").value;
    if (nombre === "") {
        alert("Tenes que ingresar su nombre");
        return;
    }
    /* alert(nombre);*/

    const numero = document.getElementById("telefono").value;
    if (numero === "") {
        alert("Tenes que ingresar tu número de teléfono");
        return;
    }
    /*alert(numero);*/
    const direccion = document.getElementById("direccion").value;
    if (direccion === "") {
        alert("Tenes que ingresar tu dirección");
        return;
    }
    /*alert(direccion);*/
    validarWhatsApp(nombre, direccion, numero);

}

function validarWhatsApp(nombre, direccion, numero) {
    const almacen = "+549" + numero;
    let texto = "Hola, soy " + nombre + " quiero pedir estos productos:%0a_PRODUCTOS_Mi dirección es " + direccion + ". Muchas gracias.";

    let productos = '';
    const carrito = leerStorage("CARRITO");
    carrito.productos.forEach( function (p) {
       productos += "1x " + p.producto.nombre + " $" + getPrecioDescuento(p.producto.precio, p.producto.descuento) + "%0a"
    });

    texto = texto.replace('_PRODUCTOS_',productos);

    const url = "https://api.whatsapp.com/send?phone=" + almacen + "&text=" + texto;
    window.open(url);
    borrarCarrito();
    $(".btn-close").click()
    alert('MUCHAS GRACIAS POR SU COMPRA');
}

/*objetos*/

class Producto {
    constructor(id, nombre, imagen, precio, descuento) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.descuento = descuento;
    }

    getPrecioDescuento() {
        return (this.precio - this.precio * this.descuento / 100);
    }

}

function convertirAtexto(obj) {
    return convertirObjetoATexto(obj);
}


function getPrecioDescuento(precio, descuento) {
    return (precio - precio * descuento / 100);
}
/*
const snaks = new Producto(1, "Combo Snaks saludables", "assets/img/promoSnakSaludable.jpg", 850, 20);
const vinos = new Producto(2, "Set de 5 Vinos", "assets/img/promoVinoUno.jpg", 2200, 40);
const pollo = new Producto(3, "Pollo a las brasas más porción de papas fritas", "assets/img/promoPolloPapas.png", 1000, 15);
const snaksDos = new Producto(4, "Combo Snaks variado", "assets/img/promoSnakUno.jpg", 1450, 20);
const fernet = new Producto(5, "Combo de Fernet más Coca-Cola", "assets/img/promoFernet.jpg", 950, 45);
const sorrentinos = new Producto(6, "Sorrentinos caseros por 12 u.", "assets/img/promoSorrentinosUno.jpg", 300, 15);



console.log(snaks);
console.log("Precio con descuento: $" + snaks.getPrecioDescuento());
console.log(vinos);
console.log("Precio con descuento: $" + vinos.getPrecioDescuento());
console.log(pollo);
console.log("Precio con descuento: $" + pollo.getPrecioDescuento());
console.log(snaksDos);
console.log("Precio con descuento: $" + snaksDos.getPrecioDescuento());
console.log(fernet);
console.log("Precio con descuento: $" + fernet.getPrecioDescuento());
console.log(sorrentinos);
console.log("Precio con descuento: $" + sorrentinos.getPrecioDescuento());
*/

/*
productos = [];
productos.push(snaks);
productos.push(vinos);
productos.push(pollo);
productos.push(snaksDos);
productos.push(fernet);
productos.push(sorrentinos);
console.log(JSON.stringify(productos));
console.log("En total hay: " + productos.length);

 */

class Cliente {
    constructor(nombre, telefono, direccion) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    saludar() {
        return "Hola " + this.nombre + " enviaremos el producto a " + this.direccion;
    }
}

// const esteban = new Cliente("Maria laura ", "3498415111", "Figueredo 2515");
// console.log(esteban.saludar());


function ordenarPorPropiedad(array, propiedad) {
    return array.sort(function (a, b) {
        var x = a[propiedad];
        var y = b[propiedad];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function mostrarCarrito() {
    var pc= CARRITO.productos ;
    var promociones = document.getElementById("listadoDeProductos");
    promociones.innerHTML = "";

    for (let i = 0; i < pc.length; i++) {
        var temporal = PRODUCTOCARRITO.replace("_NOMBRE_", pc[i].producto.nombre);
        temporal = temporal.replace("_IMAGEN_", pc[i].producto.imagen);
        temporal = temporal.replace("_NOMBRE2_", pc[i].producto.nombre);
        temporal = temporal.replace("_PRECIO_DESCUENTO_", getPrecioDescuento(pc[i].producto.precio,pc[i].producto.descuento));
        promociones.innerHTML = promociones.innerHTML + temporal;
    }
    calcularTotal();
}

class ProductoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

class Carrito {
    constructor(cliente, productos, obj) {
        this.cliente = cliente;
        this.productos = productos;

        if(obj){
            obj && Object.assign(this, obj)
        }
    }


    agregarProducto(producto, cantidad) {
        this.productos.push(new ProductoCarrito(producto, cantidad));
        guardarStorage("CARRITO", this);
    }


    calcularTotal() {
        var total = 0;
        for (var i = 0; i < this.productos.length; i++) {
            total = total + (this.productos[i].cantidad * this.productos[i].producto.precio);
        }
        return total;
    }
}

/* Tenes el carrito y si no existe lo guardamos en el storange al nuevo carrito*/
function iniciarCarrito() {
    const carrito = leerStorage("CARRITO");
    if (!carrito) {
        CARRITO = new Carrito(null, [], null);
        guardarStorage("CARRITO", CARRITO);
    } else {
        CARRITO = new Carrito(null, null, carrito);
    }
}

iniciarCarrito();



/* Agregar todos los productos al HTML de forma dinamica*/
function mostrarProductosIndex(){
    mostrarProductos();
    $('head').append('<script type="text/javascript" src="assets/js/main.js"></script>');
}

function mostrarProductos() {
    for (let i = 0; i < productos.length; i++) {
        var promociones = document.getElementById("productos");
        var temporal = PRODUCTOHTML.replace("_NOMBRE_", productos[i].nombre);
        temporal = temporal.replace("_IMAGEN_", productos[i].imagen);
        temporal = temporal.replace("_PORCENTAJE_DESCUENTO_", productos[i].descuento);
        temporal = temporal.replace("_PRECIO_", productos[i].precio);
        temporal = temporal.replace("_PRECIO_DESCUENTO_", getPrecioDescuento(productos[i].precio, productos[i].descuento));
        temporal = temporal.replace("_PRODUCTO_COMPLETO_", convertirAtexto(productos[i]));
        temporal = temporal.replace("_ID_", productos[i].id)
        promociones.innerHTML = promociones.innerHTML + temporal;
    }
    console.log(productos.length);
}

/* lo que hace es leer el HTML del prodcuto  creado y lo retorna. la variable ALLTEXT es lo que nos duevuelve el archivo*/
function readTextFile(file, callback, esParaCarrito) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                if(esParaCarrito){
                    PRODUCTOCARRITO = rawFile.responseText;
                } else {
                    PRODUCTOHTML = rawFile.responseText;
                }
                callback && callback();
            }
        }
    }
    rawFile.send(null);
}




function agregarAlCarrito(elemento) {
    let producto = document.getElementById(elemento).getElementsByTagName("input")[0].value;
    console.log(producto);
    CARRITO.agregarProducto(convertirTextoAobjetos(producto), 1);
    readTextFile("assets/almacenBalcarce/carritoProducto.html", mostrarCarrito, true);

}

readTextFile("assets/almacenBalcarce/carritoProducto.html", mostrarCarrito, true);

function calcularTotal(){
    var total= 0;
    var pc= CARRITO.productos ;

    for( var i=0; i< pc.length; i++){
        total= total + getPrecioDescuento(pc[i].producto.precio,pc[i].producto.descuento);
    }
    console.log(total);
    var total1 = document.getElementById("miniCarrito");
    var total2 = document.getElementById("subTotal");

    total1.innerHTML= "$"+total;
    total2.innerHTML= "$"+total;

}
function borrarCarrito(){
    CARRITO.productos= [];
    guardarStorage("CARRITO", CARRITO);
    mostrarCarrito();
}

function fechaDeOferta(){

    var formattedDate = new Date();
    formattedDate.setDate(formattedDate.getDate() + 15);

    var d = formattedDate.getDate();
    var m =  formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();

    let textoOferta= "Productos hasta agotar stock. Prociones validas hasta: " + d + "/" + m + "/" + y;
    $("#fechaDeOferta").html(textoOferta);
}
fechaDeOferta();


/*AJAX*/

function cargarProductoConAjax(){
    $.get( "https://my-json-server.typicode.com/Lauriminotti/clase14Minotti/productos", function( data ) {
        productos = data;
        //alert( "Productos cargados con AJAX correctamente" );
        readTextFile("assets/almacenBalcarce/producto.html", mostrarProductosIndex, false);

    });
}
cargarProductoConAjax();


function mostrarProductoOrdenados(){

    console.log("Ahora voy a imprimir por los productos por precio:");
    const productosOrdenadosPorPrecio = ordenarPorPropiedad(productos, "precio");
    for (var i = 0; i < productosOrdenadosPorPrecio.length; i++) {
        console.log(productosOrdenadosPorPrecio[i].nombre + ": $ " + productosOrdenadosPorPrecio[i].precio);
    }

    console.log("Ahora voy a imprimir los productos ordenados por nombre:");
    const productosOrdenadosPorNombre = ordenarPorPropiedad(productos, "nombre");
    for (var i = 0; i < productosOrdenadosPorNombre.length; i++) {
        console.log(productosOrdenadosPorNombre[i].nombre + ": $ " + productosOrdenadosPorNombre[i].precio);
    }

    console.log("Ahora voy a imprimir todos los productos ordenados por descuentos:");
    const productosOrdenadosPorDescuento = ordenarPorPropiedad(productos, "descuento");
    for (var i = 0; i < productosOrdenadosPorDescuento.length; i++) {
        console.log(productosOrdenadosPorDescuento[i].nombre + ":  " + productosOrdenadosPorDescuento[i].descuento + "%");
    }
}
