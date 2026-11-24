// Ordem de execução do Event Loop em Node.js

console.log("1. Início (Síncrono - Call Stack)");

setTimeout(() => {
  console.log("2. setTimeout 0s (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise (Microtask)");
});

process.nextTick(() => {
  console.log("4. process.nextTick (Microtask prioritária)");
});

console.log("5. Fim (Síncrono - Call Stack)");
