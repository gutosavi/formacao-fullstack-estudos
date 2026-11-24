// Node.js - Callbacks
const fs = require("fs");

// Exemplo de uso de callbacks para leitura de arquivos de forma síncrona
console.log("Exemplo de leitura síncrona de arquivos usando callbacks:");

const data = fs.readFileSync("example.txt");

console.log(data.toString());
console.log("Program Ended");

// Exemplo de uso de callbacks para leitura de arquivos de forma assíncrona
console.log("Exemplo de leitura assíncrona de arquivos usando callbacks:");

fs.readFile("example.txt", (err, data) => {
  if (err) {
    return console.error(err);
  }

  console.log(data.toString());
});

console.log("Program Ended");
