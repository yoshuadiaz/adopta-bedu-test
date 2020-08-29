// Estructura del CRUD
const router = require('express').Router();
const {
  crearSolicitud,
  obtenerSolicitud,
  modificarSolicitud,
  eliminarSolicitud
} = require('../controllers/solicitudes')
const auth = require('./auth')

router.get('/', auth.requerido, obtenerSolicitud)
router.get('/:id', auth.requerido, obtenerSolicitud)
router.post('/', auth.requerido, crearSolicitud)
router.put('/:id', auth.requerido, modificarSolicitud)
router.delete('/:id', auth.requerido, eliminarSolicitud)

module.exports = router;