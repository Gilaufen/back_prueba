import { Router } from "express";
import { tipoReserva, solicitudesPendientes ,verSolicitud , verSolicitudes, aceptarSolicitud,enviarCorreo, rechazarSolicitud} from "../controller/reservationType.controller.js";


const router = Router();
router.post('/documents', tipoReserva)
router.get('/requestReservation', solicitudesPendientes)
router.get('/requestIndividual/:id', verSolicitud)
router.get('/reservations/', verSolicitudes)
router.post('/aceptRequest/:id', aceptarSolicitud)
router.post('/deleteRequest/:id', rechazarSolicitud)
router.post('/sendEmail', enviarCorreo)


export default router
