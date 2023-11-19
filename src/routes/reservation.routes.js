import { Router } from "express";
import { documents, todasLasReservas ,verSolicitud , verSolicitudes, aceptarSolicitud,enviarCorreo, rechazarSolicitud} from "../controller/reservationType.controller.js";


const router = Router();
router.post('/documents', documents)
router.get('/requestReservation', todasLasReservas)
router.get('/requestIndividual/:id', verSolicitud)
router.get('/reservations/', verSolicitudes)
router.post('/aceptRequest/:id', aceptarSolicitud)
router.post('/deleteRequest/:id', rechazarSolicitud)
router.post('/sendEmail', enviarCorreo)


export default router
