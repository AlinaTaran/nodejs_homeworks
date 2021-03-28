const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URL = process.env.DB_URL;

const mongoDbConnect = mongoose.connect(URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (error) => {
  console.log(`Database connection error: ${error.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(1);
});

module.exports = mongoDbConnect;
