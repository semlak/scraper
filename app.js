var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require("mongoose");


var indexRouter = require('./routes/index');
var userRouter = require('./routes/UserRoutes');
var headlineRouter = require('./routes/HeadlineRoutes');
var noteRouter = require('./routes/NoteRoutes');
var likeRouter = require('./routes/LikeRoutes');
var scraperRouter = require('./routes/scraper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const HBS = require("express-handlebars")
app.engine("hbs", HBS({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.resolve(__dirname, 'views', 'layouts')
}));
let partialsDir = __dirname + '/views/partials';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, { useMongoClient: true });
// mongoose.connect(MONGODB_URI);
mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true }
);

// require "session"

var session = require("express-session")
app.use(session({
    secret: 'a4f8071f-c873-4447-8ee2',
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 2628000000 },
    // store: new (require('express-session'))({
    //     storage: 'mongodb',
    //     instance: mongoose, // optional
    //     host: 'localhost', // optional
    //     port: 27017, // optional
    //     db: 'test', // optional
    //     collection: 'sessions', // optional
    //     expire: 86400 // optional
    // })
}));


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/headlines', headlineRouter);
app.use('/notes', noteRouter);
app.use('/likes', likeRouter);
app.use('/scraper', scraperRouter);




// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
