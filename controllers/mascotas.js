/*  Archivo controllers/mascotas.js
 *  Simulando la respuesta de objetos Mascota
 *  en un futuro aquí se utilizarán los modelos
 */

const mongoose = require('mongoose')
const Mascota = mongoose.model('Mascota')

function crearMascota(req, res, next) {
  var mascota = new Mascota(req.body)
  mascota.anunciante = mongoose.Types.ObjectId(req.usuario.id)
  mascota.estado = 'disponible'

  mascota.save()
    .then(mascota => res.status(201).send(mascota))
    .catch(next)
}

function obtenerMascotas(req, res, next) {
  if(req.params.id) {
    Mascota.findOne({_id: req.params.id})
      .populate('anunciante')
      .then((mascota) => res.json(mascota))
      .catch(next)
  }
  else {
    Mascota.find()
      .then(mascotas => res.json(mascotas))
      .catch(next)
  }
}

function modificarMascota(req, res, next) {
  // Implementar por los estudiantes estrella de Bedu (sí, los queremos mucho a ustedes que tienen este archivo en su poder)
}

function eliminarMascota(req, res) {
  // Implementar por los estudiantes estrella de Bedu (sí, los queremos mucho a ustedes que tienen este archivo en su poder)
  res.status(200).send(`Mascota ${req.params.id} eliminado`);
}

module.exports = {
  crearMascota,
  obtenerMascotas,
  modificarMascota,
  eliminarMascota
}