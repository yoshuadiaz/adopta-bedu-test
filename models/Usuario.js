var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret

var UsuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'No puede estar vacio'],
    match: [/^[a-zA-Z0-9]+$/ , 'dato inválido'],
    index: true,
  },
  nombre: {type: String, required: true},
  apellido: {type: String, required: true},
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'No puede estar vacio'],
    match: [/\S+@\S+\.\S+/, 'email inválido'],
    index: true,
  },
  ubicacion: String,
  telefono: String,
  bio: String,
  foto: String,
  tipo: {
    type: String,
    enum: ['normal', 'anunciante']
  },
  hash: String,
  salt: String,
}, {
  timestamp: true
})

UsuarioSchema.plugin(uniqueValidator, { message: 'Ya existe' })

// Crear password

UsuarioSchema.methods.crearPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex")
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex")
}

// validar el password
UsuarioSchema.methods.validarPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex")

    return hash === this.hash
}

// Generar el JWT
UsuarioSchema.methods.generateJWT = function() {
  var today = new Date()
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}

// Mostrar la info de login en caso de éxito
UsuarioSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  }
}

// Mostrar la data publica
UsuarioSchema.methods.publicData = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    nombre: this.nombre,
    apellido: this.apellido,
    bio: this.bio,
    foto: this.foto,
    tipo: this.tipo,
    ubicacion: this.ubicacion,
    telefono: this.telefono,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

mongoose.model("Usuario", UsuarioSchema)
