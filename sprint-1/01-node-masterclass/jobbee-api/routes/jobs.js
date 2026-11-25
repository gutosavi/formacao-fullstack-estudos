const express = require("express");

// Criando uma instância do router do Express
const router = express.Router();

// Importando métodos do controller
const { getJobs } = require("../controllers/jobsController");

// Definindo a rota para obter todos os trabalhos
router.route("/jobs").get(getJobs);

// Exporta o router para ser usado em outros arquivos
module.exports = router;
