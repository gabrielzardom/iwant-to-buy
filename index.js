// Cargamos y guardamos express.
const express = require('express');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const path    = require('path');
const methodOverride = require('method-override');
const flash   = require('connect-flash');
const passport = require('passport')

//Inicializamos.
const app = express();
require('./database');
require('./src/config/passport');

//Configuracion
app.set('port',  process.env.PORT || 3000);
app.set('views', (__dirname + '/src/views'));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.use(express.static(__dirname + '/src/public'));

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secretosecretoso',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
}); 

//Usar rutas
app.use(require(__dirname + '/src/routes/users'));
app.use(require(__dirname + '/src/routes/products'));


//Consola debugger,
app.listen(app.get('port'), () => { 
  console.log('El servidor esta corriendo en el puerto: ',app.get('port'));
});
