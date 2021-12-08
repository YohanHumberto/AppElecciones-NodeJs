const path = require('path');
const express = require('express');
const app = express();
const expresshbs = require('express-handlebars');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const session = require("express-session");
const flash = require('connect-flash');
/* const csrf = require("csurf");
const csrfProtection = csrf(); */

const port = process.env.PORT || 3000;

const IsEquaelHelper = require('./Util/helpers/IsEqueal');
const PercentageHelper = require('./Util/helpers/Percentage');

const routeAdmin = require('./Routes/Admin');
const routeElector = require('./Routes/Elector');
const ErorController = require('./Controllers/404Controller')

const { sequelize } = require('./Util/DB/connection');
const Relaciones = require('./Util/DB/Relaciones');



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    },
});

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

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("Image"));

app.use(express.static(path.join(__dirname, 'Public')));
app.use("/Images", express.static(path.join(__dirname, 'Images')));

app.use(session({ secret: "anything", resave: true, saveUninitialized: false }));
/* app.use(csrfProtection); */
app.use(flash());

app.use((req, res, next) => {
    const errors = req.flash("errors");
    res.locals.Login = req.session.AdminIsAuthenticated;
    res.locals.LoginElector = req.session.ElectorIsAuthenticated;
    res.locals.Elector = req.session.Elector;
    res.locals.errorMessages = errors[0];
    res.locals.hasErrorMessages = errors.length > 0;
    /*     res.locals.csrfToken = req.csrfToken(); */
    next();
});


//DB CONFIGURATION
Relaciones();
sequelize.sync().then(() => { console.log('Connection sucessfully') }).catch(e => console.log(e));

//Routes
app.use('/admin', routeAdmin);
app.use(routeElector);
app.use('/', ErorController.GetNotFount)

//create port
app.listen(port);


