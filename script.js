// 3.1 Datos: Arreglo de objetos (Criterio 2.1.3)
const experiencias = [
    { id: 1, nombre: "Capillas de Mármol", categoria: "Navegación", lugar: "Puerto Río Tranquilo", precio: 35000, cuposDisponibles: 8, descripcion: "Navegación en bote por las espectaculares formaciones minerales del Lago General Carrera.", icono: "⛵" },
    { id: 2, nombre: "Trekking Cerro Castillo", categoria: "Trekking", lugar: "Villa Cerro Castillo", precio: 45000, cuposDisponibles: 5, descripcion: "Exigente caminata de un día con vistas directas a las agujas de roca y la laguna turquesa.", icono: "🥾" },
    { id: 3, nombre: "Laguna San Rafael", categoria: "Navegación", lugar: "Puerto Chacabuco", precio: 120000, cuposDisponibles: 12, descripcion: "Crucero de alta velocidad hacia la imponente pared del glaciar milenario San Rafael.", icono: "🚢" },
    { id: 4, nombre: "Pesca con Mosca Río Simpson", categoria: "Pesca", lugar: "Coyhaique", precio: 60000, cuposDisponibles: 3, descripcion: "Jornada de pesca deportiva guiada en uno de los ríos más famosos del mundo para la trucha.", icono: "🎣" },
    { id: 5, nombre: "Kayak en Fiordos", categoria: "Navegación", lugar: "Caleta Tortel", precio: 40000, cuposDisponibles: 6, descripcion: "Travesía remando entre las pasarelas de ciprés y las frías aguas de los fiordos patagónicos.", icono: "🛶" },
    { id: 6, nombre: "Ruta Patrimonial de Cochrane", categoria: "Cultura", lugar: "Cochrane", precio: 25000, cuposDisponibles: 10, descripcion: "Recorrido histórico guiado con pioneros locales aprendiendo sobre costumbres y esquila.", icono: "🏡" }
];

// Selectores del DOM
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const selectExperiencias = document.getElementById("experiencia");
const filtroBotones = document.querySelectorAll(".btn-filtro");
const formulario = document.getElementById("formulario-reserva");

// Inicialización de la App
document.addEventListener("DOMContentLoaded", () => {
    renderExperiencias(experiencias);
    poblarSelect();
    configurarFiltros();
    formulario.addEventListener("submit", validarFormulario);
});

// 3.2 Render dinámico al DOM utilizando createElement/appendChild (Criterio 2.1.1)
function renderExperiencias(lista) {
    contenedorTarjetas.innerHTML = ""; // Limpiamos el contenedor

    if (lista.length === 0) {
        contenedorTarjetas.innerHTML = "<p>No hay experiencias disponibles en esta categoría.</p>";
        return;
    }

    lista.forEach(exp => {
        // Crear elementos HTML de forma segura
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        const titulo = document.createElement("h3");
        titulo.textContent = `${exp.icono} ${exp.nombre}`;

        const sub = document.createElement("p");
        sub.innerHTML = `<strong>Lugar:</strong> ${exp.lugar} <br> 
                         <strong>Categoría:</strong> ${exp.categoria} <br>
                         <strong>Precio:</strong> $${exp.precio.toLocaleString('es-CL')} <br>
                         <strong>Cupos restantes:</strong> <span id="cupos-val-${exp.id}">${exp.cuposDisponibles}</span>`;

        // Contenedor ocultable para la descripción (3.3)
        const descDiv = document.createElement("div");
        descDiv.classList.add("descripcion-extra", "oculto");
        descDiv.textContent = exp.descripcion;

        // Botón Ver más / Ver menos (3.3)
        const btnVerMas = document.createElement("button");
        btnVerMas.textContent = "Ver más";
        btnVerMas.style.marginTop = "10px";
        btnVerMas.addEventListener("click", () => {
            descDiv.classList.toggle("oculto");
            btnVerMas.textContent = descDiv.classList.contains("oculto") ? "Ver más" : "Ver menos";
        });

        // Ensamblar la tarjeta
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(sub);
        tarjeta.appendChild(descDiv);
        tarjeta.appendChild(btnVerMas);

        contenedorTarjetas.appendChild(tarjeta);
    });
}

// Poblado dinámico del elemento Select para el formulario
function poblarSelect() {
    // Mantener sólo la opción por defecto
    selectExperiencias.innerHTML = '<option value="">-- Selecciona una opción --</option>';
    
    experiencias.forEach(exp => {
        const option = document.createElement("option");
        option.value = exp.id;
        option.textContent = `${exp.nombre} (${exp.lugar})`;
        selectExperiencias.appendChild(option);
    });
}

// 3.3 Filtros e interacción con classList
function configurarFiltros() {
    filtroBotones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Remover clase activa de todos los botones
            filtroBotones.forEach(b => b.classList.remove("activo"));
            // Añadir clase activa al botón presionado
            e.target.classList.add("activo");

            const categoriaSeleccionada = e.target.getAttribute("data-categoria");

            if (categoriaSeleccionada === "Todos") {
                renderExperiencias(experiencias);
            } else {
                const filtrados = experiencias.filter(exp => exp.categoria === categoriaSeleccionada);
                renderExperiencias(filtrados);
            }
        });
    });
}

// 3.4 Formulario de reserva validado con JS (Criterio 2.1.2)
function validarFormulario(event) {
    event.preventDefault(); // Detener el envío nativo y recarga de página

    // Limpiar errores previos
    limpiarErrores();

    // Capturar valores
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const expId = selectExperiencias.value;
    const personas = parseInt(document.getElementById("personas").value, 10);
    const fecha = document.getElementById("fecha").value;

    let formValido = true;

    // Validación Campo Vacío: Nombre
    if (nombre === "") {
        mostrarError("nombre", "El nombre completo es obligatorio.");
        formValido = false;
    }

    // Validación de Email (Regex estándar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        mostrarError("email", "El correo electrónico es obligatorio.");
        formValido = false;
    } else if (!emailRegex.test(email)) {
        mostrarError("email", "El formato del correo electrónico no es válido.");
        formValido = false;
    }

    // Validación: Selección de experiencia
    if (expId === "") {
        mostrarError("experiencia", "Debes seleccionar una experiencia.");
        formValido = false;
    }

    // Validación: Cantidad de personas y Cupos Disponibles
    if (isNaN(personas) || personas <= 0) {
        mostrarError("personas", "Ingresa un número válido de personas.");
        formValido = false;
    } else if (expId !== "") {
        // Buscar el objeto correspondiente dentro del arreglo de datos
        const expSeleccionada = experiencias.find(e => e.id === parseInt(expId, 10));
        
        if (personas > expSeleccionada.cuposDisponibles) {
            mostrarError("personas", `Lo sentimos, sólo quedan ${expSeleccionada.cuposDisponibles} cupos disponibles.`);
            formValido = false;
        }
    }

    // Validación: Fecha vacía
    if (fecha === "") {
        mostrarError("fecha", "La fecha de reserva es obligatoria.");
        formValido = false;
    }

    // Si pasa todas las validaciones
    if (formValido) {
        procesarReserva(parseInt(expId, 10), personas, nombre);
    }
}

// 3.5 Organización en funciones de ayuda (Criterio 2.1.4)
function mostrarError(campo, mensaje) {
    const contenedorError = document.getElementById(`error-${campo}`);
    if (contenedorError) {
        contenedorError.textContent = mensaje; // textContent por seguridad antitrampa/XSS
    }
}

function limpiarErrores() {
    const errores = document.querySelectorAll(".error-mensaje");
    errores.forEach(err => err.textContent = "");
    document.getElementById("mensaje-exito").classList.add("oculto");
}

function procesarReserva(id, cuposAProcesar, nombreUsuario) {
    // Modificar los datos reales del arreglo
    const index = experiencias.findIndex(e => e.id === id);
    experiencias[index].cuposDisponibles -= cuposAProcesar;

    // Volver a renderizar la UI para actualizar los cupos visualmente
    // Al reutilizar los botones activos de los filtros, mantenemos la consistencia
    const filtroActivo = document.querySelector(".btn-filtro.activo").getAttribute("data-categoria");
    if (filtroActivo === "Todos") {
        renderExperiencias(experiencias);
    } else {
        renderExperiencias(experiencias.filter(e => e.categoria === filtroActivo));
    }

    // Mostrar mensaje de éxito seguro usando textContent
    const mensajeExito = document.getElementById("mensaje-exito");
    mensajeExito.textContent = `¡Reserva exitosa, ${nombreUsuario}! Hemos descontado ${cuposAProcesar} cupos para la actividad.`;
    mensajeExito.classList.remove("oculto");

    // Limpiar el formulario
    formulario.reset();
}
