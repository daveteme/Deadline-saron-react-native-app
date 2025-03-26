const mongoose = require('mongoose');
const config = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


const connectDB = async () => {
  try {
    // Instead of using config.mongoURI, use the environment variable directly
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;