import { pool } from '../bd.js';
import jwt from 'jsonwebtoken'; 
import { config } from 'dotenv';
config();

//Funcion para generar un token mediante una palabra secreta

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '120m' });

    //en el primer campo se envian las credenciales y en segundo la palabra secreta 
}

//Funcion para iniciar sesion con validacion de errores 
export const inicioSession = async (req, res) => {
    console.log("si entre")
    const { email,password } = req.body;
    try {
        const [rows] = await pool.query('select * from Usuario where correoElectronico=? and contraseña=?', [email, password]);
        if (rows.length === 0) return res.status(404).json();
        console.log([rows]);

        //credenciales para el token
        const user = { 
            username: email,
            rolUser: rows[0].idRolFK,
            idUser: rows[0].idUsuario 
        };

        const accessToken = generateAccessToken(user);
        //para decodificar el token const decodeToken = jwt.decode(accessToken)

        res.status(200).json({
            token: accessToken,
            rolUser: rows[0].idRolFK,
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong',
            error
        });
    }
}

//funcion para validar el token 

export function validateToken(req, res, next) {
    const accessToken = req.header('Authorization');
    console.log(accessToken)
    if (!accessToken) {
        return res.status(401).send('Access denied: Token missing'); // Mensaje claro para token faltante
    }

    jwt.verify(accessToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Access denied: Token expired or incorrect'); // Mensaje claro para token inválido
        } else {
            // Si el token es válido, almacena el usuario en req.user si lo necesitas.
            console.log(decoded)
            res.status(200).json({decodeToken: decoded})
            console.log("El token es válido");
            next();
        }
    });
}





export const inicio = (req, res) => {
    res.status(200).json({
        username: req.user
    })
}
  
//funcion para consultar todos los usuarios registrados en la base de datos 

export const consultar = async (req, res)=>{
    try{
        const [rows] =  await pool.query('select * from view_usuario');
        res.send(rows)
    }
    catch(error){
        return res.status(500).json({
            message: "something goes wrong",
            error
        })
    }
}


//Funcion que registra un usuario 
export const registrar = async(req, res)=>{
    const { name, lastName, email, numId, typeId, password, num} = req.body;
  
    try {
    const [rows]= await pool.query('INSERT INTO Usuario (nombre, apellido, correoElectronico, numIdentificacion, tipoIdentificacion, contraseña, numeroContacto) VALUES (?,?,?,?,?,?,?)',
    [name, lastName, email, numId, typeId, password, num])
    if (rows.affectedRows === 0) return res.status(404).json();
    res.send(rows)
    }
    catch(error){
        return res.status(500).json({
            message: 'something goes wrong',
            error
        });
    }
}

export const consultarInfoUsuario = async(req, res)=>{
    const {id} = req.params
    console.log(id)
    try{
        const [rows]= await pool.query('select * from view_usuario where idUsuario = ?', [id])
        res.send(rows[0])
        }
        catch(error){
            return res.status(500).json({
                message: 'something goes wrong',
                error
            });
        }

}
export const inactivarUsuario = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const [result] = await pool.query('UPDATE usuario SET estado = 0 WHERE idUsuario = ?', [id]);

        if (result.affectedRows > 0) {
            res.send({ success: true, message: 'Usuario inactivado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al inactivar usuario:', error);
        res.status(500).json({ success: false, message: 'Ocurrió un error al inactivar el usuario', error });
    }
};

export const activarUsuario = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const [result] = await pool.query('UPDATE usuario SET estado = 1 WHERE idUsuario = ?', [id]);

        if (result.affectedRows > 0) {
            res.send({ success: true, message: 'Usuario activado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al activar usuario:', error);
        res.status(500).json({ success: false, message: 'Ocurrió un error al activar el usuario', error });
    }
};