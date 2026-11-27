This file is a merged representation of the entire codebase, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
config/
  database.js
controllers/
  authController.js
  jobsController.js
middlewares/
  auth.js
  catchAsyncErrors.js
  error.js
models/
  jobs.js
  users.js
routes/
  auth.js
  jobs.js
utils/
  errorHandler.js
  geocoder.js
  jwtToken.js
index.js
package.json
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="config/database.js">
const mongoose = require("mongoose");

// Abrindo conexão assíncrona com o banco de dados MongoDB usando Mongoose. A função connectDatabase é responsável por estabelecer a conexão com o banco de dados, utilizando a URI fornecida no arquivo .env. Quando a conexão é bem-sucedida, uma mensagem de confirmação é exibida no console, indicando que a aplicação está conectada ao MongoDB.
const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI).then((con) => {
    console.log(`Connected to MongoDB: ${con.connection.host}`);
  });
};

// Exportando a função para ser utilizada em outros arquivos do projeto, permitindo que a conexão com o banco de dados seja estabelecida quando necessário.
module.exports = connectDatabase;
</file>

<file path="controllers/authController.js">
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
</file>

<file path="controllers/jobsController.js">
// Camada do controller onde fica a lógica que recebe a requisição HTTP, processa e envia a resposta HTTP de volta para o cliente. A camada do controller é responsável por lidar com a lógica de negócios e interagir com os modelos de dados, se necessário. Ela atua como intermediária entre as rotas e os modelos, garantindo que as requisições sejam tratadas corretamente e que as respostas sejam enviadas de forma adequada.
const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// GET lista todos os trabalhos => /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find();

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});

// Atualiza um trabalho existente => /api/v1/job/:id
exports.updateJobs = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  // Chegagem de dono: só quem criou a vaga pode atualizá-lo
  if (job.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not allowed to update this job", 403),
    );
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
});

// Deleta um trabalho existente => /api/v1/job/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  // Chegagem de dono: só quem criou a vaga pode deletá-lo
  if (job.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not allowed to delete this job", 403),
    );
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Job is deleted.",
    data: job, // Retorna o trabalho deletado - não é obrigatório, mas pode ser útil para confirmação
  });
});

// Busca trabalhos dentro de um raio => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
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
});

// Cria um novo trabalho => /api/v1/job/new
exports.newJob = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; // Adiciona o ID do usuário autenticado ao corpo da requisição

  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Novo trabalho criado com sucesso.",
    data: job,
  });
});
</file>

<file path="middlewares/auth.js">
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
</file>

<file path="middlewares/catchAsyncErrors.js">
// Este middleware é usado para capturar erros em funções assíncronas e passá-los para o manipulador de erros global do Express. Ele envolve a função assíncrona fornecida e garante que qualquer erro seja capturado e passado para o próximo middleware (geralmente o manipulador de erros).
module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
</file>

<file path="middlewares/error.js">
const ErrorHandler = require("../utils/errorHandler");

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

    // Handler para erros de duplicação de chave única do MongoDB (código 11000)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;

      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
</file>

<file path="models/jobs.js">
const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const geoCoder = require("../utils/geocoder");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter Job title"],
    trim: true,
    maxlength: [100, "Job title can not exceed 100 characters."],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter Job description."],
    maxlength: [1000, "Job description can not exceed 1000 characters."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please add a valid email address."],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  company: {
    type: String,
    required: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    required: true,
    enum: {
      values: [
        "Business",
        "Information Technology",
        "Banking",
        "Education/Training",
        "Telecommunication",
        "Others",
      ],
      message: "Please select correct options for industry.",
    },
  },
  jobType: {
    type: String,
    required: true,
    enum: {
      values: ["Permanent", "Temporary", "Internship"],
      message: "Please select correct options for job type.",
    },
  },
  minEducation: {
    type: String,
    required: true,
    enum: {
      values: ["Bachelors", "Masters", "PhD"],
      message: "Please select correct options for minimum education.",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: true,
    enum: {
      values: [
        "No Experience",
        "1 year - 2 years",
        "2 years - 5 years",
        "5 years+",
      ],
      message: "Please select correct options for experience.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Please add expected salary for this job."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
  applicantsApplied: {
    type: [Object],
    select: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Geocodifica o endereço antes de salvar o trabalho
jobSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].county,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
});

// Cria um slug antes de salvar
jobSchema.pre("save", function (next) {
  // Verifica se o título foi modificado
  if (!this.isModified("title")) return;
  // Gera o slug a partir do título
  this.slug = slugify(this.title, { lower: true });
});

module.exports = mongoose.model("Job", jobSchema);
</file>

<file path="models/users.js">
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "employer"],
      message: "Please select a correct role",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false, // torna a senha não selecionável
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Criptografando a senha antes de salvar o usuário
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Retorna um token JWT
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Compara a senha fornecida com a senha armazenada no banco de dados
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Gera um token de redefinição de senha
userSchema.methods.getResetPasswordToken = function () {
  // Gera um token de redefinição de senha
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Criptografa o token e define-o no campo resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Definine o tempo de expiração do token (10 minutos)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
</file>

<file path="routes/auth.js">
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
</file>

<file path="routes/jobs.js">
const express = require("express");

// Criando uma instância do router do Express
const router = express.Router();

// Importando métodos do controller
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJobs,
  deleteJob,
} = require("../controllers/jobsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Definindo a rota para obter todos os trabalhos
router.route("/jobs").get(getJobs);

// Definindo a rota para buscar trabalhos dentro de um raio específico
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);

// Definindo a rota para criar um novo trabalho
router
  .route("/job/new")
  .post(isAuthenticatedUser, authorizeRoles("employer", "admin"), newJob);

// Definindo rota para atualizar e deletar um trabalho existente
router
  .route("/job/:id")
  .put(isAuthenticatedUser, authorizeRoles("employer", "admin"), updateJobs)
  .delete(isAuthenticatedUser, authorizeRoles("employer", "admin"), deleteJob);

// Exporta o router para ser usado em outros arquivos
module.exports = router;
</file>

<file path="utils/errorHandler.js">
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);

    // Define o nome exato da classe automaticamente (ou use 'ErrorHandler')
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    // Captura o stack trace limpo, excluindo o próprio construtor (V8 / Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ErrorHandler;
</file>

<file path="utils/geocoder.js">
// Utilitário para geocodificação de endereços usando a biblioteca node-geocoder. Ele configura o provedor de geocodificação, a chave da API e outras opções necessárias para realizar a geocodificação de endereços em coordenadas geográficas (latitude e longitude). O módulo exporta uma instância do geocoder configurado para ser usado em outras partes da aplicação.

const nodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geoCoder = nodeGeocoder(options);

module.exports = geoCoder;
</file>

<file path="utils/jwtToken.js">
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
</file>

<file path="index.js">
// Importando dependências e/ou módulos necessários
const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");

// Criando uma instância do aplicativo Express
const app = express();

// Configurando variáveis do arquivo config.env
dotenv.config({ path: "./config/config.env" });

// Conectando ao banco de dados
connectDatabase();

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

// Cookie parser middleware para lidar com cookies
app.use(cookieParser());

// Importando rotas
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);

// Middleware para lidar com erros
app.use(errorMiddleware);

// Rota de teste
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Jobee API" });
});

// Iniciando o servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`,
  );
});
</file>

<file path="package.json">
{
  "name": "jobbee-api",
  "version": "1.0.0",
  "description": "Jobee API: projeto do curso Node.js RESTful API Masterclass",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "prod": "SET NODE_ENV=production & node index.js",
    "repomix": "npx repomix --output jobbee-api(node+express+mongodb).md"
  },
  "keywords": [],
  "author": "Gustavo Savi",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "dotenv": "^18.0.10",
    "express": "^5.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.13.1",
    "node-geocoder": "^4.4.1",
    "slugify": "^1.6.9",
    "validator": "^13.15.35"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
</file>

</files>
