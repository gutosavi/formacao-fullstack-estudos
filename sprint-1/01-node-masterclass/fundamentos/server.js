// Servidor HTTP básico em Node.js (sem Express)

const tasks = [
  { id: 1, title: "Estudar Node.js nativo", done: true },
  { id: 2, title: "Criar rota GET /tarefas", done: false },
  { id: 3, title: "Testar retorno JSON", done: false },
];

const http = require("http");

const server = http.createServer((req, res) => {
  // Rota: GET /tasks
  if (req.method === "GET" && req.url === "/tasks") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(tasks));
  }

  // Rota: POST /tasks
  if (req.method === "POST" && req.url === "/tasks") {
    let body = "";

    // 1. Recebe os pedaços (chunks) de dados da requisição
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // 2. Quando todos os dados chegarem, processa o JSON
    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.title) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Title is required" }));
        }

        const newTask = {
          id: tasks.length + 1,
          title: data.title,
          done: data.done || false,
        };

        tasks.push(newTask);

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });
        return res.end(JSON.stringify(newTask));
      } catch (error) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });

    return;
  }

  // Rota não encontrada (404)
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  return res.end(JSON.stringify({ erro: "Route Not Found" }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
