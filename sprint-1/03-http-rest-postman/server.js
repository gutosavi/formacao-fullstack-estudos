import express from "express";

const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.status(200).json({
    message: "Users retrieved successfully",
    users,
  });
});

app.post("/users", (req, res) => {
  const { name } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: "Gustavo Savi",
  };

  users.push(newUser);

  return res.status(201).json(users);
});

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(3000, () => {
  console.log("Server is started...");
});
