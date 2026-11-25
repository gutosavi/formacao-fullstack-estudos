const mongoose = require("mongoose");

// Abrindo conexão assíncrona com o banco de dados MongoDB usando Mongoose. A função connectDatabase é responsável por estabelecer a conexão com o banco de dados, utilizando a URI fornecida no arquivo .env. Quando a conexão é bem-sucedida, uma mensagem de confirmação é exibida no console, indicando que a aplicação está conectada ao MongoDB.
const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI).then((con) => {
    console.log(`Connected to MongoDB: ${con.connection.host}`);
  });
};

// Exportando a função para ser utilizada em outros arquivos do projeto, permitindo que a conexão com o banco de dados seja estabelecida quando necessário.
module.exports = connectDatabase;
