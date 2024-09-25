/* eslint-disable no-unused-vars */
/* server.js
 * this file is the start entry for the api server
 * this file contain all server configurations and database connections
 * and some mechanisms for error handling about server itself
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling uncaught errors
process.on('uncaughtException', (err) => {
  console.log(err.name);
  console.log('============');
  console.log(err.message);
  console.log('Shutting down....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.MONGO_URL.replace(
  '<db_password>',
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connection successfully!');
  })
  .catch((err) => {
    console.error('Database connection error:');
    console.error(err);
  });

const port = process.env.SERVER_PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Start listining in port: ${port}...`);
});

// Handling Rejections from promises
process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log('===================');
  console.log(err.message);
  server.close(() => {
    console.log('Closing server...');
    process.exit(1);
  });
});
