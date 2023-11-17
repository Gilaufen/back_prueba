// Importa la conexión a la base de datos y el módulo nodemailer
import { pool } from '../bd.js';
import nodemailer from 'nodemailer';

// Controlador para crear una nueva solicitud de reserva
export const tipoReserva = async (req, res) => {
    const { hora, fecha } = req.body;
    try {
        // Realiza la inserción en la base de datos
        const [rows] = await pool.query('insert into solicitud values(?,?)', [hora, fecha])

        // Verifica si se afectaron filas en la base de datos
        if (rows.affectedRows === 0) return res.status(404).json({ message: 'Error al crear la solicitud' });
        res.send(rows)
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso
        return res.status(500).json({
            message: 'Error interno al procesar la solicitud',
            error
        });
    }
}

// Controlador para obtener todas las solicitudes pendientes
export const solicitudesPendientes = async (req, res) => {
    const tipo = 1
    const asesor = 3
    // Llama al procedimiento almacenado para obtener las solicitudes pendientes
    const [rows] = await pool.query('call sp_all_reservas(?, ?)', [tipo, asesor])
    res.send(rows[0]);
}

// Controlador para obtener los detalles de una solicitud específica
export const verSolicitud = async (req, res) => {
    const { id } = req.params;
    // Llama al procedimiento almacenado para obtener los detalles de la solicitud
    const [rows] = await pool.query('call sp_ver_reserva(?)', [id])
    res.send(rows[0]);
}

// Controlador para obtener todas las solicitudes en una fecha específica
export const verSolicitudes = async (req, res) => {
    try {
        const asesor = 3;
        let { fecha } = req.query;
        fecha = fecha.toString()
        // Llama al procedimiento almacenado para obtener las solicitudes en una fecha específica
        const [rows] = await pool.query('call sp_reserva_dia(?, ?)', [fecha, asesor])
        res.send(rows[0]);
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso
        console.error('Error al obtener reservas:', error);
        res.status(500).send('Error interno al obtener reservas');
    }
};

// Controlador para aceptar una solicitud
export const aceptarSolicitud = async (req, res) => {
    const { id } = req.params;
    // Llama al procedimiento almacenado para aceptar la solicitud
    const [rows] = await pool.query('call sp_update_request(?)', [id]);
    res.send({ success: true, message: 'Solicitud aceptada correctamente' });
};

// Controlador para rechazar una solicitud
export const rechazarSolicitud = async (req, res) => {
    const { id } = req.params;
    // Llama al procedimiento almacenado para rechazar la solicitud
    const [rows] = await pool.query('call sp_delet_request(?)', [id]);
    res.send({ success: true, message: 'Solicitud rechazada correctamente' });
};

// Configuración del transporte de correo usando nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'proyectoarquideco@gmail.com',
        pass: 'ewoc aoww vswh aocu'
    }
});

// Función para enviar correos electrónicos
export const enviarCorreo = async (destinatario, asunto, mensaje) => {
    console.log(destinatario)
    if (!destinatario) {
        console.log("no")
    }else{
        console.log("el destinatario es" + destinatario)
    }

    const opcionesCorreo = {
        from: 'proyectoarquideco@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    try {
        // Intenta enviar el correo y loguea la respuesta
        const info = await transporter.sendMail(opcionesCorreo);
        console.log('Correo enviado:', info.response);
        return true;
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso
        console.error('Error al enviar el correo:', error);
        return false;
    }
};
