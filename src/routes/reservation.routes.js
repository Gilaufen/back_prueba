import { Router } from "express";
import { tipoReserva, solicitudesPendientes ,verSolicitud , verSolicitudes} from "../controller/reservationType.controller.js";


const router = Router();
router.post('/documents', tipoReserva)
router.get('/requestReservation', solicitudesPendientes)
router.get('/requestIndividual/:id', verSolicitud)
router.get('/reservations/', verSolicitudes)

export default router
