const mongoose = require('mongoose')

const MascotaSchema = new mongoose.Schema({
  nombre: {type: String, required: true},
  categoria: {type: String, enum: ['perro', 'gato', 'otro']},
  fotos: [String],
  descripcion: {type: String, required: true},
  anunciante: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuario'},
  ubicacion: String,
  estado: {type: String, enum: ['adoptado', 'disponible', 'pendiente']}
}, {timestamps: true})

mongoose.model('Mascota', MascotaSchema);
