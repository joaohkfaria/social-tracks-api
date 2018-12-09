import mongoose from 'mongoose';
import { DB } from '../config';

const mongooseUrl = `mongodb://${DB.HOST}:${DB.PORT}/${DB.NAME}`;

async function connect() {
  console.info(`\nConnecting with MongoDB on ${mongooseUrl}`);
  await mongoose.connect(mongooseUrl, { useNewUrlParser: true, useCreateIndex: true });
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
