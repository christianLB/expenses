// Importa las dependencias necesarias
const cron = require("node-cron");
const checkGmail = require("./checkMail");

// Programa la tarea para que se ejecute cada minuto (ajusta la expresión cron según tus necesidades)
cron.schedule("*/1 * * * *", () => {
  checkGmail().catch(error => {
    console.error("Error:", error);
  });
});
