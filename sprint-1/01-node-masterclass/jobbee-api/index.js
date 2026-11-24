const express = require("express");
const app = express();
const dotenv = require("dotenv");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Jobee API" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`,
  );
});
