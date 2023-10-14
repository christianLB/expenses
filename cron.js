// Importa las dependencias necesarias
const cron = require('node-cron');

// Define y inicia la tarea cron
cron.schedule('*/1 * * * *', () => {
  console.log('Cron job executed at:', new Date().toISOString());
});
