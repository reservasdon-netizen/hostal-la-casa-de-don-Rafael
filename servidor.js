const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const CORREO_ADMIN = "reservasdon@gmail.com";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.CORREO_ENVIO,
        pass: process.env.PASSWORD_APP
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/reservar", async (req, res) => {

    try {

        const nombre = req.body.nombre;
        const telefono = req.body.telefono;
        const entrada = req.body.entrada;
        const salida = req.body.salida;
        const habitacion = req.body.habitacion;

        if (!nombre || !telefono || !entrada || !salida || !habitacion) {
            return res.status(400).json({
                correcto: false,
                mensaje: "Faltan datos de la reserva."
            });
        }

        const mensaje =
            "NUEVA RESERVA\n\n" +
            "HOSTAL LA CASA DE DON RAFAEL\n\n" +
            "================================\n\n" +
            "Cliente: " + nombre + "\n\n" +
            "Telefono: " + telefono + "\n\n" +
            "Fecha de entrada: " + entrada + "\n\n" +
            "Fecha de salida: " + salida + "\n\n" +
            "Habitacion: " + habitacion + "\n\n" +
            "================================\n\n" +
            "Estado: PENDIENTE DE CONFIRMACION";

        await transporter.sendMail({
            from: process.env.CORREO_ENVIO,
            to: CORREO_ADMIN,
            subject: "Nueva reserva - La Casa de Don Rafael",
            text: mensaje
        });

        res.json({
            correcto: true,
            mensaje: "Reserva enviada correctamente."
        });

    } catch (error) {

        console.error("Error al enviar el correo:", error);

        res.status(500).json({
            correcto: false,
            mensaje: "No se pudo enviar la reserva."
        });
    }
});

app.listen(PORT, () => {
    console.log("================================");
    console.log("LA CASA DE DON RAFAEL");
    console.log("================================");
    console.log("Servidor funcionando en:");
    console.log("http://localhost:" + PORT);
    console.log("================================");
});