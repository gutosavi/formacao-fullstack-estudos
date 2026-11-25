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
