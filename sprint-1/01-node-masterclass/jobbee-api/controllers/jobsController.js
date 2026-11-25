// Camada do controller onde fica a lógica que recebe a requisição HTTP, processa e envia a resposta HTTP de volta para o cliente. A camada do controller é responsável por lidar com a lógica de negócios e interagir com os modelos de dados, se necessário. Ela atua como intermediária entre as rotas e os modelos, garantindo que as requisições sejam tratadas corretamente e que as respostas sejam enviadas de forma adequada.
const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");

// GET lista todos os trabalhos => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
  const jobs = await Job.find();

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
};

// Atualiza um trabalho existente => /api/v1/job/:id
exports.updateJobs = async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job is updated.",
    data: job,
  });
};

// Deleta um trabalho existente => /api/v1/job/:id
exports.deleteJob = async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Job is deleted.",
    data: job, // Retorna o trabalho deletado - não é obrigatório, mas pode ser útil para confirmação
  });
};

// Busca trabalhos dentro de um raio => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Obtém latitude e longitude a partir do zipcode usando geocoder
  const loc = await geoCoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  const radius = distance / 3963; // 3963 é o raio da Terra em milhas

  const jobs = await Job.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
};

// Cria um novo trabalho => /api/v1/job/new
exports.newJob = async (req, res, next) => {
  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Novo trabalho criado com sucesso.",
    data: job,
  });
};
