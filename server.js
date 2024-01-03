const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err);
  console.log(`UNCAUGHT EXCEPTION! 💥. Shutting down...`);
  process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log('Database connection successful!');
});

const app = require('./app');
// console.log(process.env);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, err);
  console.log(`UNHANDLED REJECTION! 💥. Shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    process.exit('💥 Process terminaed!');
  });
});
