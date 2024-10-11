const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const userRoutes = require("./Routes/UserRoutes");
const categoryRoutes = require("./Routes/CategoryRoutes");
const communityRoutes = require("./Routes/CommunityRoutes");
const postRoutes = require("./Routes/PostRoutes");

app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", communityRoutes);
app.use("/", postRoutes);

module.exports = app;