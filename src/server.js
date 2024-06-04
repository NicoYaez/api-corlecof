const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const path = require('path');
const { fileURLToPath } = require('url');

require('../src/database.js');
const createRoles = require('./libs/initialSetup').createRoles;

const routesAuth = require('../src/routes/auth.routes');

const app = express();
app.set('PORT', process.env.PORT);
createRoles();
app.use(express.json());

app.use(cookieParser());
app.use(morgan('dev'));
const whitelist = [
    'http://localhost:8250/'
];

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/auth", routesAuth);
//app.get('*', function(req, res){ res.status(404).json({message: '404'}) });

// Static Files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('PORT'), () => {
    console.log(`Server funcionando en el puerto ${app.get('PORT')}`)
});