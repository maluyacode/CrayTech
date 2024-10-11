const dotenv = require("dotenv");
const dbConnect = require("./config/databaseConnection");
const app = require("./app");

dotenv.config({ path: "./config/.env" });
dbConnect();
require('./config/cloudinary');

const PORT = process.env.PORT || 4000;

const SERVER = app.listen(PORT, () =>
  console.log(`Server Started: http://localhost:${PORT}/`)
);
