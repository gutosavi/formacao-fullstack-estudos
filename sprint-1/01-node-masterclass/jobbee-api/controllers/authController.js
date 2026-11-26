const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

// Registrar um novo usuário => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendToken(user, 201, res);
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

  sendToken(user, 200, res);
});

// Esqueci minha senha => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ErrorHandler("User not found with this email", 404));

  // Gera um token de redefinição de senha
  const resetToken = user.getResetPasswordToken();

  // Salva o token de redefinição de senha e a data de expiração no banco de dados
  await user.save({ validateBeforeSave: false });

  // Cria a URL de redefinição de senha
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  // Cria a mensagem de email
  const message = `Your password reset token is as follows:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

  try {
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Resetar senha => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Gera o token de redefinição de senha
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400),
    );

  // Atualiza a senha do usuário
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Logout usuário => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
