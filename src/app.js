import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import spotifyRouter from './routes/spotify';
import friendsRouter from './routes/friends';
import groupsRouter from './routes/groups';
import recommendationsRouter from './routes/recommendations';
import ratingsRouter from './routes/ratings';
import MongooseService from './services/MongooseService';

const app = express();

// Mongoose connection
MongooseService.connect();

// If the connection throws an error
MongooseService.connection.on('error', (err) => {
  console.info('Error connecting on mongoose', err);
  // Waiting 10 seconds and connecting again
  console.info('\n======================================');
  console.info('Waiting to connect on MongoDB again...');
  console.info('======================================\n');
  setTimeout(() => {
    // Connecting again
    MongooseService.connect();
  }, 10000);
});
// On connection successfull
MongooseService.connection.on('connected', () => {
  console.info('\n======================================');
  console.info('Connected with MongoDB :)');
  console.info('======================================\n');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/spotify', spotifyRouter);
app.use('/groups', groupsRouter);
app.use('/friends', friendsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/ratings', ratingsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
