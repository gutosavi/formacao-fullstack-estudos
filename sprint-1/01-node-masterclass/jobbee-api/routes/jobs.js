const express = require("express");

// Criando uma instância do router do Express
const router = express.Router();

// Importando métodos do controller
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJobs,
  deleteJob,
} = require("../controllers/jobsController");

// Definindo a rota para obter todos os trabalhos
router.route("/jobs").get(getJobs);

// Definindo a rota para buscar trabalhos dentro de um raio específico
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);

// Definindo a rota para criar um novo trabalho
router.route("/job/new").post(newJob);

// Definindo rota para atualizar um trabalho existente
router.route("/job/:id").put(updateJobs);

// Definindo rota para deletar um trabalho existente
router.route("/job/:id").delete(deleteJob);

// Exporta o router para ser usado em outros arquivos
module.exports = router;
