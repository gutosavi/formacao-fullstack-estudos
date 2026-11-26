// Middleware de tratamento de erros do Express
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // usa o status do erro ou define como 500

  // Se o ambiente for de desenvolvimento, retorna detalhes completos do erro
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  // Se o ambiente for de produção, retorna uma mensagem de erro ou uma mensagem genérica
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
