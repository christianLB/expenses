import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  // Obtener los datos del cuerpo de la solicitud
  const { invoiceNumber, precioUnitario, cantidad, concepto, fechaInvoice, mesFacturado, yearFacturado } = req.body;

  // Validar que se hayan recibido todos los datos necesarios
  if (!invoiceNumber || !precioUnitario || !cantidad || !fechaInvoice || !mesFacturado || !yearFacturado) {
    return res.status(400).send('Faltan datos requeridos');
  }

  // Ruta fija al archivo XLSX template en el servidor
  const rutaTemplate = path.join(process.cwd(), 'templates', 'invoicetemplate.xlsx');

  try {
    // Crear una instancia de Workbook
    const workbook = new ExcelJS.Workbook();

    // Leer el archivo template preservando estilos y formatos
    await workbook.xlsx.readFile(rutaTemplate);

    // Obtener la primera hoja
    const hoja = workbook.worksheets[0];

    // Definir las celdas y los nuevos valores a reemplazar
    const reemplazos = {
      'H23': precioUnitario,
      'B23': cantidad,
      'C23': `Professional Services ${mesFacturado} ${yearFacturado} / Climate: Climate - EMEA`,
      //'D1': mesFacturado,
      'I11': fechaInvoice,
      'I10': invoiceNumber
      // Agrega más celdas y valores según sea necesario
    };

    // Reemplazar los valores en las celdas especificadas
    for (const [celda, nuevoValor] of Object.entries(reemplazos)) {
      // Obtener la celda
      const cell = hoja.getCell(celda);
      // Actualizar el valor de la celda
      cell.value = nuevoValor;
      // Los estilos se preservan automáticamente
    }

    // Escribir el workbook modificado en un buffer
    const bufferModificado = await workbook.xlsx.writeBuffer();

    // Configurar las cabeceras para la descarga del archivo
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=archivo_modificado.xlsx'
    );

    // Enviar el archivo modificado en la respuesta
    res.status(200).send(bufferModificado);
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).send('Error al procesar el archivo');
  }
}
