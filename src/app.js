var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var companiesRouter = require('./routes/companies');

//Aquí llamo a la ruta de las api de users
const apiUsersRouter = require('./routes/api/users')
//Aquí llamo a la ruta de las api de companies
const apiCompaniesRouter = require('./routes/api/companies')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: "Shhh, no se lo cuentes a nadie",
	resave: false,
	saveUninitialized: false,
}));
app.use(userLoggedMiddleware);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
//Aquí estoy disponiendo la posibilidad para utilizar el seteo en los formularios para el uso de los metodos put ó delete
app.use(methodOverride('_method'));

//Aquí creo la colección de mis recursos de users (APIs)
app.use('/api/users',apiUsersRouter);
//Aquí creo la colección de mis recursos de companies (APIs)
app.use('/api/companies',apiCompaniesRouter);



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
