import { pool } from '../bd.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/uploads/imageProyects/'); // Directorio donde se almacenarán las imágenes 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Renombrar el archivo
    }
  });
  
export const upload = multer({ storage });

//Funcion para registrar inmuebles
export const registroProyect=async(req,res)=>{
    const {numPisos, estadoConstruccion, areaLote, areaConstruida, numHabitaciones, numBanos, direccion, barrio, precio, tipoInmueble, descripcion}=req.body;
    const filename = req.file ? req.file.filename : null;
    const imagePath = 'src/uploads/imageProyects/' + filename;
  
    try {
      // Lee los datos binarios de la imagen
      const imageBuffer = req.file ? fs.readFileSync(imagePath) : null;

        const [rows]=await pool.query('call sp_insert_proyecto (?,?,?,?,?,?,?,?,?,?,?,?)', 
        [numPisos, estadoConstruccion, areaLote, areaConstruida, numHabitaciones, imageBuffer, numBanos, direccion, barrio, precio, tipoInmueble, descripcion])
    if (rows.affectedRows === 0) return res.status(404).json();
    res.send(rows)
    }
    catch(error){
        return res.status(500).json({
            message: 'something goes wrong',error
        })
    }
}

//funcion para actualizar e inactivar 
export const actualizarProyecto = async (req, res) => {
  const { id } = req.params
  const {numPisos, estadoConstruccion, areaLote, areaConstruida, numHabitaciones, numBanos, direccion, barrio, precio, tipoInmueble, descripcion} = req.body;
  const filename = req.file ? req.file.filename : null;
  const imagePath = 'src/uploads/imageRealEstate/' + filename;

  try {
    // Lee los datos binarios de la imagen
    const imageBuffer = req.file ? fs.readFileSync(imagePath) : null;

    const [rows] = await pool.query('call sp_update_proyecto(?,?,?,?,?,?,?,?,?,?,?,?)',
      [numPisos, estadoConstruccion, areaLote, areaConstruida, numHabitaciones, imageBuffer, numBanos, direccion, barrio, precio,tipoInmueble, descripcion, id])
    if (rows.affectedRows === 0) return res.status(404);
    res.send([rows])
  }
  catch (error) {
    return res.status(500).json({
      message: 'something goes wrong',
      error
    })
  }
}
