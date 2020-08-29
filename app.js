var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
mongoose.set("debug", true);

require('./models/Usuario')
require('./config/passport')
require('./models/Mascota')
require('./models/Solicitud')


// Objeto global de la app
var app = express();

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/v1', require('./routes'));

// Interceptando los errores 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Iniciando el servidor...
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('Escuchando en el puerto ' + server.address().port);
});