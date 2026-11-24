import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

app.post("/users", (req, res) => {
  res.status(201).json({
    name: "Gustavo",
    age: 38,
  });
});

app.listen(3000, () => {
  console.log("Server is started...");
});
