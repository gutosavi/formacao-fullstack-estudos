const express = require("express");

// Criando uma instância do router do Express
const router = express.Router();

// Importando métodos do controller
const { getJobs, newJob } = require("../controllers/jobsController");

// Definindo a rota para obter todos os trabalhos
router.route("/jobs").get(getJobs);

// Definindo a rota para criar um novo trabalho
router.route("/job/new").post(newJob);

// Exporta o router para ser usado em outros arquivos
module.exports = router;
