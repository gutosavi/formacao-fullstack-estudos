// Controller para lidar com a autenticação de usuários
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");

const { isAuthenticatedUser } = require("../middlewares/auth");

// Definindo a rota para registrar um novo usuário
router.route("/register").post(registerUser);

// Definindo a rota para login de usuário
router.route("/login").post(loginUser);

// Definindo a rota para redefinição de senha
router.route("/password/reset").post(forgotPassword);

// Definindo a rota para redefinir a senha com o token
router.route("/password/reset/:token").put(resetPassword);

// Definindo a rota para logout do usuário
router.route("/logout").get(isAuthenticatedUser, logout);

module.exports = router;
