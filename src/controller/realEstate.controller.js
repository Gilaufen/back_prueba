import { pool } from '../bd.js';
//multer 
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/imageRealEstate/'); // Directorio donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Renombrar el archivo
    }
});

export const upload = multer({ storage });

//Funcion para registrar inmuebles
export const registroInmueble = async (req, res) => {
    const { barrio, direccion, areaConstruida, areaLote, estadoConstruccion,precio, numPisos, numHabitaciones, numBanos} = req.body;
    const { filename } = req.file;
    try {
        const [rows] = await pool.query('insert into inmueble (barrio, direccion, areaConstruida, areaLote, dimensiones,precio, estadoConstruccion, numPisos, numHabitaciones, numBaños, imagen) values(?,?,?,?,?,?,?,?,?,?,?)',
            [barrio, direccion, areaConstruida, areaLote, dimensiones, estadoConstruccion,precio, numPisos, numHabitaciones, numBanos, filename])
        if (rows.affectedRows === 0) return res.status(404).json();
        res.send(rows)
    }
    catch (error) {
        return res.status(500).json({
            message: 'something goes wrong', error
        })
    }
}

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
      const images = rows.map((img) => {
        return {
          id: img.idInmueble,
          imagen: img.imagen.toString('base64'),
        };
      });
      res.json(images);
    } catch (error) {
      console.error('Error al consultar inmuebles:', error);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message, // Devolver detalles del error al cliente para fines de depuración
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
