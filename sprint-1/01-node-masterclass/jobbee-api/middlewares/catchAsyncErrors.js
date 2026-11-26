// Este middleware é usado para capturar erros em funções assíncronas e passá-los para o manipulador de erros global do Express. Ele envolve a função assíncrona fornecida e garante que qualquer erro seja capturado e passado para o próximo middleware (geralmente o manipulador de erros).
module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
