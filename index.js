require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConection } = require('./database/config');


// Crear el servidor de explres
const app = express();


// Configurar cors
app.use(cors());

// Base de datos
dbConection();

// console.log(process.env);
// ------------   Permisos   --------------
// user: mean_user
// pass: SKi6XjyPhCnAWdd6

// Rutas
app.get('/', (req, res) => {
    res.status(400).json({
        ok: true,
        msg: 'Hola mundo'
    });
});

// levantar el be
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});