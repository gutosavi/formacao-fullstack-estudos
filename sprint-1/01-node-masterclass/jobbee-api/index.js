// Importando dependências e/ou módulos necessários
const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");

// Criando uma instância do aplicativo Express
const app = express();

// Configurando variáveis do arquivo config.env
dotenv.config({ path: "./config/config.env" });

// Conectando ao banco de dados
connectDatabase();

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

// Cookie parser middleware para lidar com cookies
app.use(cookieParser());

// Importando rotas
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);

// Middleware para lidar com erros
app.use(errorMiddleware);

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
