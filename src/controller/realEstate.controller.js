// Importa los módulos necesarios
import { pool } from '../bd.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/imageRealEstate/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });



// Función para registrar inmuebles
export const registroInmueble = async (req, res) => {
  const { numPisos, estadoConstruccion, areaConstruida, areaLote, numHabitaciones, numBanos, direccion, barrio, precio, tipoInmueble } = req.body;

  try {
    // Verifica si hay un archivo adjunto
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado un archivo de imagen.' });
    }

    const { filename } = req.file;
    const imagePath = 'src/uploads/imageRealEstate/' + filename;

    // Lee los datos binarios de la imagen
    const imageBuffer = fs.readFileSync(imagePath);

    // Llama al procedimiento almacenado para insertar el inmueble
    const [rows] = await pool.query('CALL sp_insert_inmueble(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [numPisos, estadoConstruccion, areaLote, areaConstruida, numHabitaciones, imageBuffer, numBanos, direccion, barrio, precio, tipoInmueble]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json();
    } else {
      res.send(rows);
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Algo salió mal',
      error: error.message // Devuelve el mensaje de error específico
    });
  }
};


//funcion para actualizar e inactivar 
export const actualizarInmueble =async(req,res)=>{
  const {id} = req.params
  const {numPisos, estadoConstruccion, areaConstruida, areaLote, numHabitaciones, numBanos, direccion, barrio, descripcion, tipoInmueble, clasificacion}=req.body;
  const filename = req.file ? req.file.filename : null;
  const imagePath = 'src/uploads/imageRealEstate/' + filename;

  try {
    // Lee los datos binarios de la imagen
  const imageBuffer = fs.readFileSync(imagePath);

  const [rows]=await pool.query('update Inmueble set numpisos = IFNULL(?,numpisos), estadoconstruccion = IFNULL(?, estadoconstruccion), areaLote =  IFNULL(?, areaLote), numHabitaciones = IFNULL(?, numHabitaciones), imagenes = IFNULL(?, imagenes), numBaños = IFNULL(?, numBaños), direccion = IFNULL(?, direccion), barrio = IFNULL(?,barrio), descripcionProyecto = IFNULL(?, descripcionProyecto), tipoInmueble = IFNULL(?, tipoInmueble), clasificacion = IFNULL(?,clasificacion) where idInmueble = ? ',
  [numPisos, estadoConstruccion, areaConstruida, areaLote, numHabitaciones, imageBuffer, numBanos, direccion, barrio, descripcion, tipoInmueble, clasificacion, id])
  if (rows.affectedRows === 0) return res.status(404).json();
  res.send(rows)
  }
  catch(error){
      return res.status(500).json({
          message: 'something goes wrong',
          error
      })
  }
  
}


//consultar todos los inmuebles
export const consultarInmuebles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Inmueble');

    const images = [];

    for (const img of rows) {
      const imagePath = `${img.idInmueble}.jpg`; 
      
      // Asegúrate de que img.imagenes contiene datos binarios
      const imageBuffer = Buffer.from(img.imagenes, 'base64');

      await fs.promises.writeFile(path.join('src/dbFiles/images/',imagePath), imageBuffer);

      images.push({
        id: img.idInmueble,
        imagen: imagePath
      });
    }
    console.log(images);    // Dentro del bucle for en tu función consultarInmuebles


    console.log(rows);
    res.json({ rows, images });

  } catch (error) {
    console.error('Error al consultar inmuebles:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error,
    });
  }
};
  

// Consulta el inmueble individualmente
export const verInmueble = async (req, res) => {
    const { idInmueble } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Inmueble WHERE idInmueble = ?', [idInmueble]);
        res.send(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el inmueble' });
    }
};
