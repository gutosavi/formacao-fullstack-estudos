// Cria, envia e salva o token no cookie
const sendToken = (user, statusCode, res) => {
  // Cria um token JWT
  const token = user.getJwtToken();

  // Define as opções do cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = sendToken;
