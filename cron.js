// Importa las dependencias necesarias
const cron = require('node-cron');
const fetch = require('node-fetch');

// Codifica las etiquetas de las URLs
const checkBBVAUrl = `https://www.anaxi.net/api/checkMail?label=${encodeURIComponent('BBVA/gastos')}`;
const checkMercadonaUrl = `https://www.anaxi.net/api/checkMail?label=${encodeURIComponent('Mercadona')}`;

// Programa la tarea para que se ejecute cada minuto para BBVA
cron.schedule('*/1 * * * *', () => {
  fetch(checkBBVAUrl)
    .then(response => response.json()) // Asegúrate de convertir la respuesta a JSON
    .then(data => {
      console.log('Respuesta del endpoint BBVA:', data);
    })
    .catch(error => {
      console.error('Error al realizar la solicitud GET a BBVA:', error);
    });
});

// Programa la tarea para que se ejecute cada dos minutos para Mercadona
cron.schedule('*/2 * * * *', () => {
  fetch(checkMercadonaUrl)
    .then(response => response.json()) // Asegúrate de convertir la respuesta a JSON
    .then(data => {
      console.log('Respuesta del endpoint Mercadona:', data);
    })
    .catch(error => {
      console.error('Error al realizar la solicitud GET a Mercadona:', error);
    });
});
