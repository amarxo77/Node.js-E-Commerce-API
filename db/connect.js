const { connect } = require('mongoose');

const connectDB = async () => {
  await connect(process.env.MONGO_URI);
  console.log('connected to the database');
};

module.exports = connectDB;
