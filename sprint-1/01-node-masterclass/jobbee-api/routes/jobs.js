const express = require("express");

// Criando uma instância do router do Express
const router = express.Router();

// Importando métodos do controller
const {
  getJobs,
  newJob,
  getJobsInRadius,
} = require("../controllers/jobsController");

// Definindo a rota para obter todos os trabalhos
router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);

// Definindo a rota para criar um novo trabalho
router.route("/job/new").post(newJob);

// Exporta o router para ser usado em outros arquivos
module.exports = router;
