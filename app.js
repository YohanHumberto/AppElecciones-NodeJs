const path = require('path');
const express = require('express');
const app = express();
const expresshbs = require('express-handlebars');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const port = process.env.PORT || 3000;

const IsEquaelHelper = require('./Util/helpers/IsEqueal');
const PercentageHelper = require('./Util/helpers/Percentage');

const routeAdmin = require('./Routes/Admin');
const routeElector = require('./Routes/Elector');
const ErorController = require('./Controllers/404Controller')

const DATABASE = require('./Util/DB/connection');
const { Candidatos } = require('./Models/Candidatos');
const { Partidos } = require('./Models/Partidos');
const { PuestoElectivo } = require('./Models/PuestoElectivo');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    },
});


app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("Image"));

app.use(express.static(path.join(__dirname, 'Public')));
app.use("/Images", express.static(path.join(__dirname, 'Images')));


//engine/*  */
app.engine("hbs", expresshbs({
    layoutsDir: 'views/layout/', defaultLayout: 'main-layout', extname: 'hbs',
    helpers: {
        IsEqual: IsEquaelHelper.IsEquael,
        Percentage: PercentageHelper.Percentage
    }
}));
app.set("view engine", "hbs");
app.set("views", "views");

//DB CONFIGURATION

Candidatos.belongsTo(Partidos, { constraint: true, onDelete: "CASCADE" });
Candidatos.belongsTo(PuestoElectivo, { constraint: true, onDelete: "CASCADE" });
PuestoElectivo.hasMany(Candidatos);
Partidos.hasMany(Candidatos);

DATABASE.conectar();

//Routes

app.use('/admin', routeAdmin);
app.use(routeElector);
app.use('/', ErorController.GetNotFount)

//create port
app.listen(port);


