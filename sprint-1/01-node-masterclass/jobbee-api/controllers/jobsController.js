// GET /api/v1/jobs
exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Esta rota vai mostrar todos os trabalhos no futuro",
  });
};
