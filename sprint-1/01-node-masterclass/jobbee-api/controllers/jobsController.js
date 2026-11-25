// Camada do controller onde fica a lógica que recebe a requisição HTTP, processa e envia a resposta HTTP de volta para o cliente. A camada do controller é responsável por lidar com a lógica de negócios e interagir com os modelos de dados, se necessário. Ela atua como intermediária entre as rotas e os modelos, garantindo que as requisições sejam tratadas corretamente e que as respostas sejam enviadas de forma adequada.

// GET /api/v1/jobs
exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Esta rota vai mostrar todos os trabalhos no futuro",
  });
};
