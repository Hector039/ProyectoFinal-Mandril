
//Luxon Date Time
let DateTime = luxon.DateTime;
let actual = DateTime.now();

let listaDias = []
let mesAnio = []
const baseDatos = []

///Calendario obtenido de internet y adaptado para el proyecto

async function mostrarCalendario(year, month) {///uso de async y await para recibir la información de reservas json

    const respuesta = await
        fetch("reservas.json")
    const datos = await respuesta.json()

    datos.forEach(objeto => {
        baseDatos.push(objeto)
    })

    let now = new Date(year, month - 1, 1);
    let last = new Date(year, month, 0);
    let primerDiaSemana = (now.getDay() == 0) ? 7 : now.getDay();
    let ultimoDiaMes = last.getDate();
    let dia = 0;
    let resultado = "<li>";
    let diaActual = 0;
    let last_cell = primerDiaSemana + ultimoDiaMes;

    // hacemos un bucle hasta 42, que es el máximo de valores que puede
    // haber... 6 columnas de 7 dias
    for (let i = 1; i <= 42; i++) {
        if (i == primerDiaSemana) {
            // determinamos en que dia empieza
            dia = 1;
        }
        if (i < primerDiaSemana || i >= last_cell) {
            // celda vacia
            resultado += "<li>&nbsp;</li>";
        } else {
            // mostramos el dia
            if ((dia == actual.day && month == actual.month && year == actual.year))
                resultado += "<li class='hoy'>" + dia + "</li>";
            else
                resultado += "<li>" + dia + "</li>";
            dia++;
        }
        if (i % 7 == 0) {
            if (dia > ultimoDiaMes) {
                break;
            }

        }

    }

    let meses = Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

    // Calculamos el siguiente mes y año
    nextMonth = month + 1;
    nextYear = year;
    if (month + 1 > 12) {
        nextMonth = 1;
        nextYear = year + 1;
    }

    // Calculamos el anterior mes y año
    prevMonth = month - 1;
    prevYear = year;
    if (month - 1 < 1) {
        prevMonth = 12;
        prevYear = year - 1;
    }

    const caption = document.querySelectorAll(".caption")
    caption[0].innerHTML = "<div>" + meses[month - 1] + " / " + year + "</div><div><a onclick='mostrarCalendario(" + prevYear + "," + prevMonth + ")'>&lt; &nbsp</a> <a onclick='mostrarCalendario(" + nextYear + "," + nextMonth + ")'>&gt;</a></div>";

    let mes = meses[month - 1]
    let anio = year;

    mesAnio = []
    mesAnio.push(mes, anio)

    const calendarioBody = document.querySelectorAll(".calendario-body")
    calendarioBody[0].innerHTML = resultado;
    calendarioBody[0].childNodes.forEach(elemento => {
        listaDias.push(elemento)
    })

    baseDatos.forEach(function recorrerDiaDispo(elemento) {//obtengo los días no disponibles para mostrar en calendario
        if (mesAnio[1] === elemento.anio && mesAnio[0] == elemento.mes && elemento.dispo === false) {
            listaDias.forEach(function mostrarDiaNoDispo(objeto, indice) {
                if (parseInt(listaDias[indice].innerText) === elemento.fecha) {
                    objeto.classList.add("no-dispo");
                }
            })
        }
    });


    listaDias.forEach((elemento, indice) => {
        elemento.addEventListener("click", function () {

            const dia = listaDias[indice].innerText;
            console.log("Se hizo click en día: " + dia);

            mostrarReserva(dia)//Muestro el día de la reserva

            horarioNoDispo(parseInt(dia)) //cargo el innertext parseado del elemento escuchado como parámetro de la función
            resumenDia.innerText = `Día: ${dia} de ${mesAnio[0]} del ${mesAnio[1]}`
        });
    })
}

mostrarCalendario(actual.year, actual.month).catch(() => {//control de errores con .catch
    Swal.fire({
        icon: 'error',
        title: 'Ups... Hubo un problema actualizando el calendario.',
        text: 'Por favor intenta más tarde.',
    })
});

const listaHorarios = document.querySelectorAll(".horarios li")

function horarioNoDispo(fecha) {  //función para mostrar los horarios no dispnibles dentro de un día específico en el calendario, en el caso de que el mismo exista en el array.

    listaDias.forEach(elemento => {//dejo marcado el día seleccionado para que el usuario lo visualice.
        elemento.classList.remove("dia-select");
        if (elemento.innerText == fecha) {
            elemento.classList.add("dia-select");
        }
    })

    const resultadoDispoHora = baseDatos.some(o => o.fecha === fecha)//consulto primero la existencia de la fecha en el array. Devuelva true si es que existe. solo para visualizarlo

    if (resultadoDispoHora === true) {      //si el día existe entra en este if      

        listaHorarios.forEach(elemento => elemento.classList.remove("no-dispo"))//para que no se sumen las clases en cada selección de click, las limpio antes.

        baseDatos.forEach(elemento => {  //como el día existe en el array baseDatos, lo recorro y le comparo la fecha con la elegida con click por el usuario.                   
            if (mesAnio[1] === elemento.anio && mesAnio[0] == elemento.mes && elemento.fecha === fecha) {
                if (elemento.hor1 === false) {
                    listaHorarios[0].classList.add("no-dispo");//cada vez que encuentre el valor de HOR como falso, añadirá la clase no-dispo en el elemento del listado de nodos de los horarios para mostrarlos en rojo.
                }
                if (elemento.hor2 === false) {
                    listaHorarios[1].classList.add("no-dispo");
                }
                if (elemento.hor3 === false) {
                    listaHorarios[2].classList.add("no-dispo");
                }
                if (elemento.hor4 === false) {
                    listaHorarios[3].classList.add("no-dispo");
                }
                if (elemento.hor5 === false) {
                    listaHorarios[4].classList.add("no-dispo");
                }
                if (elemento.hor6 === false) {
                    listaHorarios[5].classList.add("no-dispo");
                }
                if (elemento.hor7 === false) {
                    listaHorarios[6].classList.add("no-dispo");
                }
                if (elemento.hor8 === false) {
                    listaHorarios[7].classList.add("no-dispo");
                }
            }
        })
    } else {
        listaHorarios.forEach(elemento => elemento.classList.remove("no-dispo"));
    }//si el día no existe en el array Julio, significa que todos los días están disponibles en esa fecha.
}

const parrafoReserva = document.querySelectorAll(".reserva-contenedor p")

listaHorarios.forEach((objeto, indice) => {///recorro el listado de nodos de horarios pero con forEach() y escucho el evento de click en cada elemento, poniendo como parámetro el índice para manipularlo.
    objeto.addEventListener("click", function () {
        listaHorarios.forEach(elemento => elemento.classList.remove("dia-select"))
        objeto.classList.add("dia-select");
        const horarioSelecUsuario = indice;
        const horarioSelecHora = objeto.innerText;
        mostrarReservaHora(horarioSelecHora)
        resumenHora.innerText = `Hora: ${horarioSelecHora}`
        botonComprar.innerHTML = `<button id="boton-comprar" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Reservar</button>`
    });
});

function mostrarReserva(dia) {
    parrafoReserva[0].classList.add("reserva-final");//clase para agregarle estilo
    parrafoReserva[0].innerText = `Día: ${dia},`;
    parrafoReserva[1].classList.add("reserva-final");
    parrafoReserva[1].innerText = `Hora?`
    sessionStorage.setItem("DiaElegido", dia)
}

function mostrarReservaHora(hora) {
    parrafoReserva[1].innerText = `${hora}`; //muestro el horario de la reserva
    sessionStorage.setItem("HoraElegida", hora)
}



const lugares = [{ lugar: "Rafaela", km: 0 }, { lugar: "Santa Fe", km: 120 },//dispongo un array fijo con obejtos de lugares y km para referenciar
{ lugar: "Rosario", km: 245 }, { lugar: "Aeropuerto Rosario", km: 243 },
{ lugar: "Aeroparque", km: 535 }, { lugar: "Aeropuerto Ezeiza", km: 558 }]

const selectLugarSalida = document.querySelectorAll(".inputs-salida input");
const selectLugarDestino = document.querySelectorAll(".inputs-destino input");

const arraySalidaDestino = []
const arrayGatillo = []

const tarifaAdultos = 35 //con valores constantes fijo referencia para cotizar por kilómetro
const cantidadAdultos = document.querySelector("#cantidad-adultos") //cantidades elegidas por el usuario

const tarifaMenores = 30
const cantidadMenores = document.querySelector("#cantidad-menores")

const tarifaInfantes = 20
const cantidadInfantes = document.querySelector("#cantidad-infantes")

const valija = 3000
const cantidadValija = document.querySelector("#cantidad-equipaje")

const tarifaFlex = 3200
const cantidadFlex = document.querySelector("#tarifa-flex")

selectLugarSalida.forEach((objeto, indice) => {///recorro el listado de nodos de Lugares de salida y escucho el evento de click en cada elemento, poniendo como parámetro el índice para manipularlo.
    objeto.addEventListener("click", function () {
        const salidaSelec = indice;
        arrayGatillo.push(salidaSelec)//pusheo el indice del lugar de salida a un array temporal gatillo
        funcionGatillo()
    });
})

selectLugarDestino.forEach((objeto, indice) => {
    objeto.addEventListener("click", function () {
        if (arrayGatillo.length === 1) {
            const destinoSelec = indice;
            arrayGatillo.push(destinoSelec)//pusheo el indice del lugar de destino a un array temporal gatillo
            funcionGatillo()
        } else {//en caso que el usuario marque elija primero el destino, da un alert y reinicia los selectores
            Swal.fire({
                icon: 'warning',
                title: 'Por favor selecciona primero tu salida.',
            })
            selectLugarDestino.forEach(element => element.checked = false);
        }
    });
});

function funcionGatillo() {//funcion gatillo con condicionales. Mostrará los lugares elegidos en un contenedor de forma dinámica
    if (arrayGatillo.length === 2 && arrayGatillo[0] != arrayGatillo[1]) {
        arraySalidaDestino.push(arrayGatillo[0], arrayGatillo[1]);

        mostrarSalida(lugares[arraySalidaDestino[0]].lugar)//funciones para mostrar los lugares seleccionados
        mostrarDestino(lugares[arraySalidaDestino[1]].lugar)

        const destinos = {//creo un objeto con los kms a cotizar y guardo en el session storage
            salida: lugares[arraySalidaDestino[0]].lugar,
            destino: lugares[arraySalidaDestino[1]].lugar
        }

        const lugaresElegidos = JSON.stringify(destinos)
        sessionStorage.setItem("destinos", lugaresElegidos)

        const kilometros = Math.abs(lugares[arraySalidaDestino[0]].km - lugares[arraySalidaDestino[1]].km);//acá calculo los kilómetros apr acotizar el valor del viaje
        kmtotales.splice(0, 1, kilometros)//me aseguro que el array kmtotales, tenga los kilometros cargados para cotizar (está inicializado en 0)

        precioAdultos.innerText = `Adultos - $ ${cotizarAdultos(kmtotales, tarifaAdultos, cantidadAdultos.value)}`//muestro los valores cotizados de forma dinámica
        precioMenores.innerText = `Menores - $ ${cotizarMenores(kmtotales, tarifaMenores, cantidadMenores.value)}`
        precioInfantes.innerText = `Infantes - $ ${cotizarInfantes(kmtotales, tarifaInfantes, cantidadInfantes.value)}`

    } else if (arrayGatillo[0] === arrayGatillo[1]) {//condición si el usuario elige misma salida y destino
        Swal.fire({
            icon: 'warning',
            title: 'Por favor selecciona dos lugares diferentes.',
        })
        selectLugarSalida.forEach(element => element.checked = false);//reseteo los selectores
        selectLugarDestino.forEach(element => element.checked = false);
        arrayGatillo.splice(0)//reincio el array gatillo

    } else if (arrayGatillo.length === 3) {//condición si el usuario elige más de dos veces los lugares
        selectLugarSalida.forEach(element => element.checked = false);
        selectLugarDestino.forEach(element => element.checked = false);
        arrayGatillo.splice(0)
        arraySalidaDestino.splice(0)

        Swal.fire({
            icon: 'warning',
            title: 'Por favor seleccione Salida y Destino nuevamente.',
        })
        salDestContenedor[0].innerText = `Salida:`
        salDestContenedor[1].innerText = `Destino:`

    }
}

const salDestContenedor = document.querySelectorAll(".salida-destino-contenedor p");

function mostrarSalida(salida) {
    salDestContenedor[0].classList.add("reserva-final");//clase para agregarle estilo
    salDestContenedor[0].innerText = `Salida: ${salida}`;
    resumenSalida.innerText = `Salida: ${salida}`
}
function mostrarDestino(destino) {
    salDestContenedor[1].classList.add("reserva-final");
    salDestContenedor[1].innerText = `Destino: ${destino}`;
    resumenDestino.innerText = `Destino: ${destino}`
}

let kmtotales = [0]//seteo los kilómetros en 0 cada vez que se recarga la página. todas las cotizaciones darán cero si el usuario intenta cotizar sin elegir los lugrs antes

function cotizarAdultos(kmTotal, tarifaAdultos, cantidadAdultos) {
    return kmTotal * tarifaAdultos * cantidadAdultos;
}

const precioAdultos = document.querySelector("#adulto-total")
precioAdultos.innerText = `Adultos - $ ${cotizarAdultos(kmtotales, tarifaAdultos, cantidadAdultos.value)}`

const saldoFinal = document.querySelector("#precio-final");

cantidadAdultos.addEventListener("input", () => {//eventos sobre los selectores de cantidades de pasajeros y maletas y tarifa flexible
    precioAdultos.innerText = `Adultos - $ ${cotizarAdultos(kmtotales, tarifaAdultos, cantidadAdultos.value)}`;
    resumenAdultos.innerText = `${cantidadAdultos.value} Adulto/s - $ ${cotizarAdultos(kmtotales, tarifaAdultos, cantidadAdultos.value)}`
})

function cotizarMenores(kmTotal, tarifaMenores, cantidadMenores) {
    return kmTotal * tarifaMenores * cantidadMenores;
}

const precioMenores = document.querySelector("#menores-total")

cantidadMenores.addEventListener("input", () => {
    precioMenores.innerText = `Menores - $ ${cotizarMenores(kmtotales, tarifaMenores, cantidadMenores.value)}`;
    resumenMenores.innerText = `${cantidadMenores.value} Menor/es - $ ${cotizarMenores(kmtotales, tarifaMenores, cantidadMenores.value)}`
});

function cotizarInfantes(kmTotal, tarifaInfantes, cantidadInfantes) {
    return kmTotal * tarifaInfantes * cantidadInfantes;
}

const precioInfantes = document.querySelector("#infantes-total")

cantidadInfantes.addEventListener("input", () => {
    precioInfantes.innerText = `Infantes - $ ${cotizarInfantes(kmtotales, tarifaInfantes, cantidadInfantes.value)}`;
    resumenInfantes.innerText = `${cantidadInfantes.value} Infante/s - $ ${cotizarInfantes(kmtotales, tarifaInfantes, cantidadInfantes.value)}`
});

const totalValija = (valija, cantidadValija) => valija * cantidadValija;

const precioEquipaje = document.querySelector("#equipaje-total");

cantidadValija.addEventListener("input", () => {
    precioEquipaje.innerText = `Equipaje ($3000) - $ ${totalValija(valija, cantidadValija.value)}`;
    resumenValija.innerText = `${cantidadValija.value} Valija/s - $ ${totalValija(valija, cantidadValija.value)}`
});

const totalFlex = (tarifaFlex, cantidadFlex) => tarifaFlex * cantidadFlex;

const precioTarifaFlex = document.querySelector("#flex-total");
cantidadFlex.addEventListener("input", () => {
    precioTarifaFlex.innerText = `Tarifa Flex - $ ${totalFlex(tarifaFlex, cantidadFlex.value)}`;
    resumenflex.innerText = `${cantidadFlex.value} Tarifa Flexible - $ ${totalFlex(tarifaFlex, cantidadFlex.value)}`
})

const inputs = document.querySelectorAll("select")

let precios = []

function selectorInput() {
    precios.push(cotizarAdultos(kmtotales, tarifaAdultos, cantidadAdultos.value),//pusheo todos los precios en el array precios
        cotizarMenores(kmtotales, tarifaMenores, cantidadMenores.value),
        cotizarInfantes(kmtotales, tarifaInfantes, cantidadInfantes.value),
        totalValija(valija, cantidadValija.value), totalFlex(tarifaFlex, cantidadFlex.value))

    const IVA = 1.21

    function sumarTotales(a, b, c, d, e) {
        return a + b + c + d + e;
    }

    const totalSinIva = sumarTotales(...precios)//Uso el spread de arrays para sumar el contenido del array precios.

    const totalConIva = (totalSinIva, IVA) => (totalSinIva * IVA).toFixed(2);
    saldoFinal.innerText = `$ ${totalConIva(totalSinIva, IVA)}`
    resumenTotal.innerText = `Total (IVA inc) = $ ${totalConIva(totalSinIva, IVA)}`
    precios = []//devuelvo a 0 el array precios
}

inputs.forEach(input => input.addEventListener("input", selectorInput))//escucho en todos los immputs para cotizar en tiempo real el monto final

///sección guardado en Session y Local Storage:
const botonComprar = document.querySelector("#boton-comprar");
botonComprar.addEventListener("click", guardarReserva)

const historialContenedor = document.querySelector("#historial-contenedor")
const listaHistorial = document.createElement("ul");
historialContenedor.append(listaHistorial);


function guardarReserva() {//guardo todos los valores de la reserva en el session storage
    const reservaDestinos = JSON.parse(sessionStorage.getItem("destinos"))
    const reservaDia = sessionStorage.getItem("DiaElegido");
    const reservaHora = sessionStorage.getItem("HoraElegida");

    botonPagar.innerText = "Pagar"

    if (reservaDestinos != null && reservaDia != null && reservaHora != null) {//condiciono la creación de un objeto con los valores de la reserva final
        const reservaFinal = new reserva(reservaDestinos.salida, reservaDestinos.destino, mesAnio[1], mesAnio[0], reservaDia, reservaHora)
        localStorage.setItem("reserva", JSON.stringify(reservaFinal));//guardo en local storage para que perdure

        let arrayHistorial = [];
        arrayHistorial.unshift(reservaFinal)

        localStorage.setItem("historial", JSON.stringify(arrayHistorial))//guardo también el array con el obejto de la reserva en el LStorage

        const nuevoDatoHistorial = JSON.parse(localStorage.getItem("historial"))//traigo la reserva sólo para imprimirla a modo de información
        listaHistorial.innerHTML += `<li class="item-historial">Salió de ${nuevoDatoHistorial[0].salida} hasta ${nuevoDatoHistorial[0].destino} el día ${nuevoDatoHistorial[0].dia} de ${nuevoDatoHistorial[0].mes} del ${nuevoDatoHistorial[0].anio} a las ${nuevoDatoHistorial[0].hora}</li>`

        resetCerrar()
    } else {
        setTimeout(() => {
            modal.hide()
        }, 500);

        Swal.fire({
            icon: 'warning',
            title: 'Por favor completa la reserva para continuar.',
        })
    }
}

class reserva {//constructor para crear el objeto con la info de la reserva
    constructor(salida, destino, anio, mes, dia, hora) {
        this.salida = salida;
        this.destino = destino;
        this.anio = anio;
        this.mes = mes;
        this.dia = dia;
        this.hora = hora
    }
}

const datosHistorial = JSON.parse(localStorage.getItem("historial"))

function mostrarHistorial() {//función que al cargar muestra la última reserva que se hizo, obtenida desde el Local Storage
    if (datosHistorial != null) {
        for (elemento of datosHistorial) {
            listaHistorial.innerHTML += `<li class="item-historial">Salió de ${elemento.salida} hasta ${elemento.destino} el día ${elemento.dia} de ${elemento.mes} del ${elemento.anio} a las ${elemento.hora}</li>`
        }
    }
}

mostrarHistorial()

//seccion modal de pago
const resumenSalida = document.querySelector("#salida");
const resumenDestino = document.querySelector("#destino");
const resumenDia = document.querySelector("#dia");
const resumenHora = document.querySelector("#hora");
const resumenAdultos = document.querySelector("#adultos");
const resumenMenores = document.querySelector("#menores");
const resumenInfantes = document.querySelector("#infantes");
const resumenValija = document.querySelector("#valija");
const resumenflex = document.querySelector("#flex");
const resumenTotal = document.querySelector("#total");
const horaReserva = document.querySelector("#hora-reserva")
horaReserva.innerText = `Fecha de la confirmación: El día ${actual.day} del mes ${actual.month} del ${actual.year} a las ${actual.toLocaleString(DateTime.TIME_SIMPLE)}`
const cerraPrimerModal = document.querySelector("#cerrar-primer-modal")
cerraPrimerModal.addEventListener("click", resetCerrar)
const botonPagar = document.querySelector("#pagar-boton")
botonPagar.innerText = "Pagar"

function actualizarDia(anio, mes, diaS, horS) {
    const reservaAGrabar = new reservaParaActualizar(anio, mes, diaS, true, true, true, true, true, true, true, true, true)
    const resultadoDispoHora = baseDatos.some(o => o.anio === anio && o.mes == mes && o.fecha === diaS)
    console.log(resultadoDispoHora);
    if (resultadoDispoHora === true) {
        baseDatos.forEach(function (elemento) {

            if (anio === elemento.anio && mes == elemento.mes && diaS === elemento.fecha) {
                if (horS === "1:30 Hs") {
                    elemento.hor1 = false;
                } else if (horS === "4:30 Hs") {
                    elemento.hor2 = false;
                } else if (horS === "8:00 Hs") {
                    elemento.hor3 = false;
                } else if (horS === "11:00 Hs") {
                    elemento.hor4 = false;
                } else if (horS === "14:00 Hs") {
                    elemento.hor5 = false;
                } else if (horS === "17:00 Hs") {
                    elemento.hor6 = false;
                } else if (horS === "20:00 Hs") {
                    elemento.hor7 = false;
                } else if (horS === "23:00 Hs") {
                    elemento.hor8 = false
                }
            }
        })
    } else {

        if (horS === "1:30 Hs") {
            reservaAGrabar.hor1 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "4:30 Hs") {
            reservaAGrabar.hor2 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "8:00 Hs") {
            reservaAGrabar.hor3 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "11:00 Hs") {
            reservaAGrabar.hor4 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "14:00 Hs") {
            reservaAGrabar.hor5 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "17:00 Hs") {
            reservaAGrabar.hor6 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "20:00 Hs") {
            reservaAGrabar.hor7 = false
            baseDatos.push(reservaAGrabar)
        } else if (horS === "23:00 Hs") {
            reservaAGrabar.hor8 = false
            baseDatos.push(reservaAGrabar)
        }
    }

    baseDatos.forEach(elemento => {
        if (anio === elemento.anio && mes == elemento.mes && diaS === elemento.fecha) {
            if (elemento.hor1 === false && elemento.hor2 === false && elemento.hor3 === false && elemento.hor4 === false && elemento.hor5 === false && elemento.hor6 === false && elemento.hor7 === false && elemento.hor8 === false) {
                elemento.dispo = false;
                listaDias.forEach(function mostrarDiaNoDispo(objeto, indice) {
                    if (parseInt(listaDias[indice].innerText) === elemento.fecha) {
                        objeto.classList.add("no-dispo");
                    }
                })

                listaHorarios.forEach(elemento => {
                    if (elemento.innerText === horS) {
                        elemento.classList.add("no-dispo")
                    }
                })
            }
        }
    })

    localStorage.setItem("baseDeDatos", JSON.stringify(baseDatos))
}

class reservaParaActualizar {//constructor para crear el objeto con la info de la reserva
    constructor(anio, mes, fecha, dispo, hor1, hor2, hor3, hor4, hor5, hor6, hor7, hor8) {
        this.anio = anio;
        this.mes = mes;
        this.fecha = fecha;
        this.dispo = dispo;
        this.hor1 = hor1;
        this.hor2 = hor2;
        this.hor3 = hor3;
        this.hor4 = hor4;
        this.hor5 = hor5;
        this.hor6 = hor6;
        this.hor7 = hor7;
        this.hor8 = hor8;
    }
}

function resetCerrar() {
    kmtotales = [0]

    selectLugarSalida.forEach(element => element.checked = false);
    selectLugarDestino.forEach(element => element.checked = false);

    arrayGatillo.splice(0)
    arraySalidaDestino.splice(0)

    parrafoReserva[0].innerText = `Dia?`;
    parrafoReserva[1].innerText = `Horario?`;

    salDestContenedor[0].innerText = `Salida?`;
    salDestContenedor[1].innerText = `Destino?`;

    cantidadAdultos.value = 0;
    precioAdultos.innerText = `Adultos - $ 0`

    cantidadMenores.value = 0;
    precioMenores.innerText = `Menores - $ 0`

    cantidadInfantes.value = 0;
    precioInfantes.innerText = `Infantes - $ 0`

    cantidadValija.value = 0;
    precioEquipaje.innerText = `Equipaje ($3000) - $ 0`;

    cantidadFlex.value = 0
    precioTarifaFlex.innerText = `Tarifa Flex - $ 0`;

    saldoFinal.innerText = `$ - 0`

    precios = [];

    listaHorarios.forEach(elemento => elemento.classList.remove("dia-select"));
    listaDias.forEach(elemento => elemento.classList.remove("dia-select"));

    botonComprar.innerHTML = `<button id="boton-comprar">Reservar</button>`;
}

const forms = document.getElementById("reset")
forms.addEventListener('submit', function (event) {
    event.preventDefault()
    guardarFinal()
})

let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

async function guardarFinal() {
    botonPagar.innerText = "Procesando pago..."
    const reservaConfirmada = JSON.parse(localStorage.getItem("reserva"));
    console.log(reservaConfirmada);
    actualizarDia(mesAnio[1], mesAnio[0], parseInt(reservaConfirmada.dia), reservaConfirmada.hora)
    sessionStorage.clear()

    resetCerrar()

    setTimeout(() => {
        modal.hide()
        forms.reset()
        Swal.fire({
            icon: 'success',
            title: 'Compra exitosa!',
            text: 'Su reserva se Guardó correctamente. Muchas Gracias por su confianza.',
        })
    }, 2000);

}
