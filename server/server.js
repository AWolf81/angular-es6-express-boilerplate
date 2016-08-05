import http from 'http';
import flash from 'connect-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport'; //'passport-restify'; //'passport';
// import passportLocal from 'passport-local';
import sockets from './sockets';
import SocketIO from 'socket.io';

import express from 'express';
import bodyParser from 'body-parser';
// import session from 'express-session' ;
import cookieParser from 'cookie-parser' ;
// import session from 'cookie-session';
import webpack from 'webpack';
// import webpackConfig from (process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../webpack.config');
import historyApiFallback from 'connect-history-api-fallback';
// import fallback from 'express-history-api-fallback';
import morgan from 'morgan';
import restify from 'express-restify-mongoose';
// import restifyMongoose from 'restify-mongoose';

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

// swagger for api docs.
// import minimist from 'minimist';
// import swagger from 'swagger-node-express';
// Configuring Passport
// import passport from 'passport';
import webpackConfig from '../webpack.config';
const compiler = webpack(webpackConfig);

const isProduction = (process.env.NODE_ENV === 'production');


if ( !isProduction ) {
  // load development config @todo how to do this with es6?

  // load config files
  // load dev. db config here later with require
}
//else use production db config

import dbConfig from './config/database';
// import swaggerDoc from './api/swagger';

const app = express();
const router = express.Router();

// const subpath = express();

// const LocalStrategy = passportLocal.Strategy;

// const argv = minimist(process.argv.slice(2));

// console.log(dbConfig.url); //<<<<<<< fixme url = undef
// mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
//console.log('connection to', dbConfig.url);
//mongoose.connect(dbConfig.url); //, function(err) { // connect to mongoDB database
import configurePassport from './passport/config';
// load routes
// import routes from './routes'; // dyn loading not working with es6!!
// routes(app);
// var multer = require('multer'); // v1.0.5

// var upload = multer(); // for parsing multipart/form-data

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(cookieParser('secret'));
// app.use(expressSession({secret: 'mySecretKey', cookie: { maxAge: 60000 }}));
// app.use(session({cookie: { secret: 'mySecretKey', maxAge: 60000 }}));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
// app.use(flash());

// passport.use(new LocalStrategy(User.authenticate()));
// app.use(cookieParser());
// app.use(session({
//   secret: 'the princess and the frog',
//   saveUninitialized: false,
//   resave: false
// }));

// app.use(morgan('short'));
// Step 0: Configure mongoose =================

// restify.serve(router, mongoose.model('Customer', new mongoose.Schema({
//   name: { type: String, required: true },
//   comment: { type: String }
// })))

import {Todo} from './models/todo';


//dbConnect();
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.initialize());

let passportRouter = configurePassport(router);

var preMiddleConfig = {
  preMiddleware: function(req,res,next) { // premiddle is working but error not returned yet!!!!
    passport.authenticate('jwt', {
      session: false }, 
      function(err, user, info) {
        if (err || info) {
          // console.log('auth error', err, info);
          return next(err || info);
        }
        
        next(); // execute next route
    })(req, res, next)
  }
};

restify.serve(passportRouter, Todo); //, preMiddleConfig); // serve todo

mongoose.connect(dbConfig.url);

// app.use('/', publicApi);
app.use(passportRouter); //router);
// app.use('/auth', authApi);

// Step 1: Create & configure a webpack compiler
// const root = webpackConfig.output.publicPath; //`${__dirname}/public`;

// app.use(fallback('index.html', {root}));

// Step 2: Attach the dev middleware to the compiler & the server
app.use(historyApiFallback({
  verbose: false,
  //index: webpackConfig.output.publicPath + '/index.html'
}));

if ( !isProduction ) {
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    //contentBase: webpackConfig.config.PATHS.app,
    publicPath: webpackConfig.output.publicPath
  }));

  // Step 3: Attach the hot middleware to the compiler & the server
  app.use(webpackHotMiddleware(compiler, {
    log: console.log, //path: '/__webpack_hmr', 
    heartbeat: 10 * 1000
  }));
}
else {

  // production code
  // make express look in the public directory for assets (css/js/img)
  app.use(express.static(__dirname + '/public'));
  
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}



if ( !isProduction ) {
  // development error handler
  // Middleware error handler for json response
  function handleError(err,req,res,next){
      var output = {
          error: {
              name: err.name,
              message: err.message,
              text: err.toString()
          }
      };
      var statusCode = err.status || 500;
      res.status(statusCode).json(output);
  }

  app.use([
      handleError
  ]);
}

let server = http.createServer(app);
// let server = http.Server(app);
let io = SocketIO.listen(server);
// set the port of our application
// process.env.PORT lets the port be set by Heroku
let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Listening on %j', server.address())
});

let socket = sockets(io);

// io.on('connection', (socket) => {
//     console.log('user connected');
//     socket.on('captain', (data) => {
//         console.log(data);
//         socket.emit('Hello');
//     });
// });