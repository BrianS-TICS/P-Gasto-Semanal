// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastosListado = document.querySelector("#gastos ul");

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = this.presupuesto; // Toma el mismo valor al inicio
        this.gastos = [];
    }

    setGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce(
            (total, gasto) => total + gasto.cantidad,
            0
        );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    InsertarPresupuesto(objPresupuesto) {
        const { presupuesto, restante } = objPresupuesto;
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    InsertarAlerta(comentario, tipo) {
        // Div padre de formulario
        const divPrimario = document.querySelector(".primario");

        // Div para mostrar aviso
        const dvMostrarAlerta = document.createElement("div");

        // Insercion de estilos a los elementos
        dvMostrarAlerta.classList.add("p-3", "mt-3", "mb-2", "text-center");
        // Insercion de comentatio en alerta
        dvMostrarAlerta.textContent = comentario;

        if (tipo === "error") {
            // Fondo rojo si es error
            dvMostrarAlerta.classList.add("alert", "alert-danger");
        } else if (tipo === "correcto") {
            // Fondo verde si no lo es
            dvMostrarAlerta.classList.add("alert", "alert-success");
        }

        // Insercion antes del inicio del formulario
        divPrimario.insertBefore(dvMostrarAlerta, formulario);

        // Eliminacion de alerta
        setTimeout(() => {
            dvMostrarAlerta.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        const ul = document.querySelector(".list-group");

        // Si contiene elementos se eliminan
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        gastos.forEach((gasto) => {
            const { nombre, cantidad, id } = gasto;

            const divTexto = document.createElement("div");
            divTexto.classList.add("d-flex");

            const pTexto = document.createElement("p");
            pTexto.textContent = `${nombre}`;
            pTexto.classList.add("font-weight-bold", "m-0");

            const span = document.createElement("span");
            span.textContent = `$${cantidad}`;
            span.className = "badge badge-primary pt-1 mx-2 mt-1";

            divTexto.appendChild(pTexto);
            divTexto.appendChild(span);

            // Creacion de li
            const liGasto = document.createElement("li");
            liGasto.classList.add(
                "list-group-item",
                "eliminaDefault",
                "d-flex",
                "justify-content-between",
                "align-items-center"
            );

            // Alternativa
            //liGasto.className = "alert alert-primary eliminaDefault d-flex justify-content-between align-items-center";
            liGasto.dataset.id = id;

            liGasto.appendChild(divTexto);

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger");
            btnEliminar.type = "button";
            btnEliminar.textContent = "Eliminar";

            btnEliminar.onclick = () => {
                eliminarGasto(id);
            }

            liGasto.appendChild(btnEliminar);
            gastosListado.appendChild(liGasto);
        });
    }

    ActualizarRestante(restante, presupuesto) {
        const spanRestante = document.querySelector("#restante");
        const divRestante = document.querySelector(".restante");

        spanRestante.textContent = restante;

        // Cambio el color del alert
        if (restante <= presupuesto / 4) {
            divRestante.classList.remove("alert-primary","alert-warning");    
            divRestante.classList.add("alert-danger");

        } else if (restante <= presupuesto / 2) {
            divRestante.classList.remove("alert-danger","alert-primary");    
            divRestante.classList.add("alert-warning");

        } else {
            divRestante.classList.remove("alert-danger","alert-warning");    
            divRestante.classList.add("alert-primary");
        }

        // Si el total es cero o menor
        if (restante <= 0) {
            ui.InsertarAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
        else{
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }

     eliminarLiDeGasto(id) {
         const lis = document.querySelectorAll('.list-group li');
         lis.forEach(li => {
             if (li.getAttribute("data-id") == id) {
                 li.remove();
             }
         });
     }
}

const ui = new UI();

// Inicializo la variable de objeto vacia
let objPresupuesto;

// Funciones
function preguntarPresupuesto() {
    let presupuestoDigitado = prompt("Cual es tu presupuesto?");

    if (
        presupuestoDigitado <= 0 ||
        presupuestoDigitado === "" ||
        presupuestoDigitado === null ||
        isNaN(presupuestoDigitado)
    ) {
        window.location.reload();
    }

    // Asigno valor a la vaiable
    objPresupuesto = new Presupuesto(presupuestoDigitado);

    ui.InsertarPresupuesto(objPresupuesto);
}

// Añade gastos al arreglo
function agregarGasto(e) {
    e.preventDefault();

    // Lectura de inputs
    const inpGasto = document.querySelector("#gasto").value;
    const inpCantidad = Number(document.querySelector("#cantidad").value);

    // Validacion
    if (inpGasto === "" || inpCantidad === "") {
        // Err
        ui.InsertarAlerta("Todos los campos son obligatorios", "error");
        return;
    } else if (inpCantidad <= 0 || isNaN(inpCantidad)) {
        // Asignacion
        console.log(inpCantidad);
        ui.InsertarAlerta("La cantidad no puede ser negativa", "error");
        return;
    }

    // Inserto
    ui.InsertarAlerta("Agregado correctamente", "correcto");

    // Generar objeto gasto
    const gasto = {
        nombre: inpGasto,
        cantidad: inpCantidad,
        id: Date.now(),
    };

    // Añado gasto a arreglo de objeto
    objPresupuesto.setGasto(gasto);

    // Reinicio el formulario
    formulario.reset();

    // Inserta los gastos
    const { gastos, restante, presupuesto } = objPresupuesto;
    ui.mostrarGastos(gastos);
    ui.ActualizarRestante(restante, presupuesto);
}
function eliminarGasto(id) {
    
    // Elimina de objeto
    objPresupuesto.eliminarGasto(id);
    
    // Elimina de html
    const {restante, presupuesto, gastos} = objPresupuesto;
    ui.mostrarGastos(gastos);
    
    // Actualiza restante
    ui.ActualizarRestante(restante,presupuesto);
}