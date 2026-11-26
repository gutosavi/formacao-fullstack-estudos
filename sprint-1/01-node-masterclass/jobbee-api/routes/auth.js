// Controller para lidar com a autenticação de usuários
const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

// Definindo a rota para registrar um novo usuário
router.route("/register").post(registerUser);

// Definindo a rota para login de usuário
router.route("/login").post(loginUser);

module.exports = router;
