// Controller para lidar com a autenticação de usuários
const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/authController");

// Definindo a rota para registrar um novo usuário
router.route("/register").post(registerUser);

module.exports = router;
