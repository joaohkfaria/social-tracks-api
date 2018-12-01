import mongoose from 'mongoose';
import config from '../config';

const mongooseUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;

async function connect() {
  console.info(`\nConnecting with MongoDB on ${mongooseUrl}`);
  await mongoose.connect(mongooseUrl, { useNewUrlParser: true });
}

async function close() {
  console.info(`\nClosing connection Mongo on ${mongooseUrl}`);
  await mongoose.connection.close();
  await mongoose.connection.db.close();
}

export default {
  connect,
  close,
  connection: mongoose.connection,
};
