import { pool } from '../bd.js';
const nodemailer = require('nodemailer');


export const tipoReserva = async (req, res) => {
    const { idTipoReserva, hora, fecha } = req.body;
    try {
        const [rows] = await pool.query('insert into solicitud values(?,?)', [hora, fecha])

        if (rows.affectedRows === 0) return res.status(404).json({ message: 'no se que paso' });
        res.send(rows)
    }
    catch (error) {
        return res.status(500).json({
            message: 'something goes wrong',
            error
        });
    }
}



export const solicitudesPendientes = async (req, res) => {
    const tipo = 1
    const asesor =3
    const [rows] = await pool.query('call sp_all_reservas(?, ?)', [tipo, asesor])
    res.send(rows[0]);
}

export const verSolicitud = async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query('call sp_ver_reserva(?)', [id])
    res.send(rows[0]);
}

export const verSolicitudes = async (req, res) => {
    try {
        const asesor = 3;
        let { fecha } = req.query; 
        fecha = fecha.toString()
        const [rows] = await pool.query('call sp_reserva_dia(?, ?)', [fecha, asesor])
        res.send(rows[0]);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).send('Error interno al obtener reservas');
    }
};

export const aceptarSolicitud = async (req, res) => {
        const {id} = req.params;
        const [rows] = await pool.query('call sp_set_1_request(?)', [id])
        res.send(rows[0]);
};


export const rechazarSolicitud = async (req, res) => {
    const {id} = req.params;
    const [rows] = await pool.query('call sp_delet_request(?)', [id])
    res.send(rows[0]);
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'proyectoarquideco@gmail.com',
        pass: 'sena1234'
    }
});

export const enviarCorreo = async (destinatario, asunto, mensaje) => {
    const opcionesCorreo = {
        from: 'proyectoarquideco@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    try {
        const info = await transporter.sendMail(opcionesCorreo);
        console.log('Correo enviado:', info.response);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
};