
const express = require('express');
require('dotenv').config();
var cors = require('cors');


const {dbConnection} = require('./database/config');

//Crear Servidor express

const app = express();

//Configurar CORS
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {

    res.status(400).json({
        ok: true,
        mgs: 'Hola mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});