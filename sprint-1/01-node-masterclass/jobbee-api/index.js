// Importando dependências e/ou módulos necessários
const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Criando uma instância do aplicativo Express
const app = express();

// Configurando variáveis do arquivo config.env
dotenv.config({ path: "./config/config.env" });

// Conectando ao banco de dados
connectDatabase();

// Importando rotas
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Jobee API" });
});

// Iniciando o servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`,
  );
});
