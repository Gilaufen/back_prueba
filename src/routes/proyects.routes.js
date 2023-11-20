import { Router } from "express";
import {registroProyect, actualizarProyecto, upload, verProyectos} from '../controller/proytects.controller.js'
const router = Router()


router.post('/createProyect', upload.single('imagen'), registroProyect)
router.post('/updateProyect/:id', upload.single('imagen'), actualizarProyecto)
router.get('/consultProyects', verProyectos)




export default router