import { Router } from "express";
import { tipoReserva, solicitudesPendientes } from "../controller/reservationType.controller.js";


const router = Router();
router.post('/documents', tipoReserva)
router.get('/requestReservation', solicitudesPendientes)

export default router
