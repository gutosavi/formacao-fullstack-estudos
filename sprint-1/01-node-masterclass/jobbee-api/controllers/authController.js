const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/users");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});
