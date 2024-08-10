require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

app.use("/api/details", require("./src/routes/detailsRoute"));
app.use("/api/rate", require("./src/routes/rateRoute"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
