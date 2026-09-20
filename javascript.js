const express = require("express");
const habitacionesIniciales = [

    {
        id: 1,
        nombre: "Habitación 101",
        tipo: "Habitación estándar",
        estado: "disponible",
        imagen: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlhTLQvisRZaMctzRYSW8RmfUyyPoPQZxR8emGYZbj80q0MI8LnhEHz5kjdmny5u_RG6dS-fTYStX1Aa4nk26MjYkNlJCoBZgxDoyNVY9-0XhIScOvqMDLCGbrXeRa9JjvZ4wysZQ=w397-h298-k-no"
    },

    {
        id: 2,
        nombre: "Habitación 102",
        tipo: "Habitación familiar",
        estado: "disponible",
        imagen: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWljuxxJOMzjd9n7ZGN8y2DAgarjpMGE1NwzJyVDyRyijrUaZK4Zehy3jbPEDtfHrU610meUqC1pGXBj4Dsi-m7PY9PkNXCxuoVUprPNokwUUt9N3dWwn1h8v5U2Cg8NiMXoDyuzdA=w397-h298-k-no"
    },

    {
        id: 3,
        nombre: "Habitación 103",
        tipo: "Habitación para huéspedes",
        estado: "disponible",
        imagen: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmEoKKMjIOa9FxtN8p27WzVUC_y_h19JeaZZ4CiI0zPHOjKKspMYNxIyP-Ir4T2wF-g_B980ahT-DkSwtxh1gRuthOa1HHlvXnXcnLT7KzLPveCNJh0oVoFPoa54VSn_aYfcOfi=w397-h298-k-no"
    }

];


function obtenerHabitaciones() {

    const guardadas =
        localStorage.getItem("habitacionesHotel");


    if (guardadas) {

        return JSON.parse(guardadas);

    }


    localStorage.setItem(
        "habitacionesHotel",
        JSON.stringify(habitacionesIniciales)
    );


    return habitacionesIniciales;

}


function mostrarHabitaciones() {

    const contenedor =
        document.getElementById("listaHabitaciones");


    if (!contenedor) return;


    const habitaciones =
        obtenerHabitaciones();


    contenedor.innerHTML = "";


    habitaciones.forEach(habitacion => {

        let textoEstado;

        let claseEstado;

        let disponible = false;


        if (habitacion.estado === "disponible") {

            textoEstado = "🟢 Disponible";

            claseEstado = "disponible";

            disponible = true;

        }

        else if (habitacion.estado === "ocupada") {

            textoEstado = "🔴 Ocupada";

            claseEstado = "ocupada";

        }

        else {

            textoEstado = "🟠 Fuera de servicio";

            claseEstado = "fuera";

        }


        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "habitacion";


        tarjeta.innerHTML = `

            <img
                src="${habitacion.imagen}"
                alt="${habitacion.nombre}"
            >

            <div class="habitacion-contenido">

                <h3>
                    ${habitacion.nombre}
                </h3>

                <p>
                    ${habitacion.tipo}
                </p>

                <span class="estado ${claseEstado}">
                    ${textoEstado}
                </span>

                <button
                    class="boton-reservar"
                    ${!disponible ? "disabled" : ""}
                    onclick="seleccionarHabitacion(${habitacion.id})"
                >
                    ${
                        disponible
                        ? "Reservar habitación"
                        : "No disponible"
                    }
                </button>

            </div>
        `;


        contenedor.appendChild(tarjeta);

    });


    cargarOpcionesReserva();

}


function cargarOpcionesReserva() {

    const select =
        document.getElementById("habitacion");


    if (!select) return;


    const habitaciones =
        obtenerHabitaciones();


    select.innerHTML = `

        <option value="">
            Selecciona una habitación
        </option>

    `;


    habitaciones.forEach(habitacion => {

        if (habitacion.estado === "disponible") {

            const opcion =
                document.createElement("option");


            opcion.value =
                habitacion.id;


            opcion.textContent =
                habitacion.nombre +
                " - " +
                habitacion.tipo;


            select.appendChild(opcion);

        }

    });

}


function seleccionarHabitacion(id) {

    const select =
        document.getElementById("habitacion");


    if (!select) return;


    select.value = id;


    document
        .getElementById("reserva")
        .scrollIntoView({
            behavior: "smooth"
        });

}


const formulario =
    document.getElementById("formReserva");


if (formulario) {

    formulario.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const nombre =
                document.getElementById("nombre").value;

            const telefono =
                document.getElementById("telefono").value;

            const entrada =
                document.getElementById("entrada").value;

            const salida =
                document.getElementById("salida").value;

            const habitacionId =
                document.getElementById("habitacion").value;


            const habitaciones =
                obtenerHabitaciones();


            const habitacion =
                habitaciones.find(
                    h => h.id == habitacionId
                );


            if (!habitacion) {

                alert(
                    "Selecciona una habitación."
                );

                return;

            }


            if (habitacion.estado !== "disponible") {

                alert(
                    "Esta habitación no está disponible."
                );

                mostrarHabitaciones();

                return;

            }


            try {

                const respuesta =
                    await fetch(
                        "/reservar",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    nombre:
                                        nombre,

                                    telefono:
                                        telefono,

                                    entrada:
                                        entrada,

                                    salida:
                                        salida,

                                    habitacion:
                                        habitacion.nombre

                                })

                        }
                    );


                const resultado =
                    await respuesta.json();


                if (resultado.correcto) {

                    alert(
                        "✅ Reserva enviada correctamente.\n\n" +
                        "El administrador recibirá la solicitud por correo."
                    );


                    formulario.reset();

                }

                else {

                    alert(
                        "❌ " +
                        resultado.mensaje
                    );

                }


            }

            catch (error) {

                console.error(error);


                alert(
                    "❌ No se pudo conectar con el servidor."
                );

            }

        }
    );

}


mostrarHabitaciones();
```
