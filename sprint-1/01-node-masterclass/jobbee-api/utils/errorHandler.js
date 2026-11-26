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
