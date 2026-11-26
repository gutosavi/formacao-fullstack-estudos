const jwt = require("jsonwebtoken");
const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Verifica o token e cria req.user
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new ErrorHandler("Login first", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// Verifica se o usuário é admin
exports.authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler("Not allowed to access this resource", 403));
    }
    next();
  };
