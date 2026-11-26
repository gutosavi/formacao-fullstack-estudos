// Controller para lidar com a autenticação de usuários
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controllers/authController");

// Definindo a rota para registrar um novo usuário
router.route("/register").post(registerUser);

// Definindo a rota para login de usuário
router.route("/login").post(loginUser);

router.route("/password/reset").post(forgotPassword);

module.exports = router;
