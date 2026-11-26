const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");

// Registrar um novo usuário => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Gera um token JWT para o usuário registrado
  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
  });
});

// Login usuário => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Verifica se o email e a senha foram fornecidos
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Busca o usuário no banco de dados pelo email e incluindo a senha no resultado
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Compara a senha fornecida com a senha armazenada no banco de dados
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Gera um token JWT para o usuário autenticado
  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});
