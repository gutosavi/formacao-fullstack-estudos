const express = require("express");
const app = express();
const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Connecting to the database
connectDatabase();

// Importing routes
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);

// Middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Jobee API" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`,
  );
});
