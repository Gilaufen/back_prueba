import { Router } from 'express'
import {registroInmueble, actualizarInmueble, upload, consultarInmuebles, verInmueble} from '../controller/realEstate.controller.js'

const router = Router()
router.post('/registroInmueble', upload.single('imagen'), registroInmueble)
router.patch('/actualizarInmueble/:id', upload.single('imagen'), actualizarInmueble)
router.get('/verInmuebles', consultarInmuebles)
router.get('/verInmueble/:idInmueble', verInmueble)

export default router