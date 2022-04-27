
const express = require('express');
require('dotenv').config();
var cors = require('cors');


const {dbConnection} = require('./database/config');

//Crear Servidor express

const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del Body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});