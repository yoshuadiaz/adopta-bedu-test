/*  Archivo controllers/solicituds.js
 *  Simulando la respuesta de objetos Solicitud
 *  en un futuro aquí se utilizarán los modelos
 */

const mongoose = require('mongoose')
const Usuario = mongoose.model('Usuario')
const Solicitud = mongoose.model('Solicitud')
const Mascota = mongoose.model('Mascota')
mongoose.set('useFindAndModify', false)

function crearSolicitud(req, res, next) {
  Mascota.findById(req.query.mascota_id, async (err, mascota) => {
    if(!mascota || err) {
      return res.sendStatus(401)
    }
    if(mascota.estado === 'adoptado') {
      return res.sendStatus('La mascota ya ha sido adoptada')
    }

    const solicitud = new Solicitud()
    solicitud.mascota = req.query.mascota_id
    solicitud.anunciante = mascota.anunciante
    solicitud.solicitante = req.usuario.id
    solicitud.estado = 'pendiente'
    solicitud.save()
    .then(async s => {
      await Usuario.findOneAndUpdate({_id: req.usuario.id}, {tipo: 'anunciante'})
      res.status(201).json(s)
    })
    .catch(next)
  }).catch(next)
}

function obtenerSolicitud(req, res, next) {
  if(!req.params.id) {
    Solicitud.find({
      $or: [
        {solicitante: req.usuario.id},
        {anunciante: req.usuario.id}
      ]
    })
    .then(solicitudes => {
      res.json(solicitudes)
    })
    .catch(next)
  } else {
    Solicitud.findOne({_id: req.params.id})
    .then(async solicitud => {
      await solicitud.populate('mascota').execPopulate()
      if(solicitud.estado === 'aceptada') {
        await solicitud.populate('anunciante', 'nombre').execPopulate()
        await solicitud.populate('solicitante', 'nombre').execPopulate()
        res.json(solicitud)
      } else {
        res.send(solicitud)
      }
    })
  }
}

function modificarSolicitud(req, res) {
  // simulando un solicitud previamente existente que el solicitud utili
  var solicitud1 = new Solicitud(1, 4, '4/06/2020', 3, 8, 'pendiente')
  var modificaciones = req.body
  solicitud1 = { ...solicitud1, ...modificaciones }
  res.send(solicitud1)
}

function eliminarSolicitud(req, res) {
  res.status(200).send(`Solicitud ${req.params.id} eliminada`);
}

module.exports = {
  crearSolicitud,
  obtenerSolicitud,
  modificarSolicitud,
  eliminarSolicitud
}