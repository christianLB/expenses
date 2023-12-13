// Importa las dependencias necesarias
const cron = require('node-cron');
const axios = require('axios');

// URL de tu endpoint
const endpointURL = `${process.env.API_URL}/checkMail`;

// Programa la tarea para que se ejecute cada minuto
cron.schedule('*/1 * * * *', () => {
  axios.get(endpointURL)
    .then(response => {
      console.log('Respuesta del endpoint:', response.data);
    })
    .catch(error => {
      console.error('Error al realizar la solicitud GET:', error);
    });
});
