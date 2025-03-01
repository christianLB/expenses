import React, { useState } from 'react';
import {
  AppShell,
  Paper,
  Stack,
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import LoginBtn from "../components/loginbtn.tsx";
// Importa getSession si lo necesitas en tu código
// import { getSession } from "next-auth/react";

export default function Invoice() {
  // Estados para los campos de entrada
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [concepto, setConcepto] = useState('');
  const [fechaInvoice, setFechaInvoice] = useState(null);
  const [mesFacturado, setMesFacturado] = useState('');
  const [yearFacturado, setYearFacturado] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Lista de meses en inglés
  const months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ];

  const descargarArchivo = async () => {
    // Crear un objeto con los datos a enviar
    const datos = {
      yearFacturado,
      invoiceNumber,
      precioUnitario,
      cantidad,
      concepto,
      fechaInvoice: fechaInvoice ? fechaInvoice.toISOString() : null,
      mesFacturado,
    };

    // Enviar los datos al backend
    fetch('/api/createInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al generar el archivo');
        }
        return response.blob();
      })
      .then((blob) => {
        // Crear una URL para el blob y simular un clic para descargar
        const url = window.URL.createObjectURL(new Blob([blob]));
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.setAttribute('download', 'archivo_modificado.xlsx');
        document.body.appendChild(enlace);
        enlace.click();
        enlace.parentNode.removeChild(enlace);
      })
      .catch((error) => console.error('Error al descargar el archivo:', error));
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group>
          <LoginBtn />
        </Group>
      </AppShell.Header>
      {/* Asegúrate de que este título y favicon estén dentro del componente adecuado */}
      {/* <title>Invoice</title>
      <link rel="icon" href="/favicon.ico" /> */}

      <AppShell.Main>
        <Paper mih={550} m="xl" p="xl" withBorder shadow="lg">
          <Stack>
            <NumberInput
              label="Número de Factura"
              value={invoiceNumber}
              onChange={(value) => setInvoiceNumber(value)}
              required
            />
            <NumberInput
              label="Precio Unitario"
              value={precioUnitario}
              onChange={(value) => setPrecioUnitario(value)}
              required
            />
            <NumberInput
              label="Cantidad"
              value={cantidad}
              onChange={(value) => setCantidad(value)}
              required
            />
            <TextInput
              label="Concepto"
              value={concepto}
              onChange={(event) => setConcepto(event.currentTarget.value)}
              required
            />
            <DatePicker
              label="Fecha del Invoice"
              value={fechaInvoice}
              onChange={setFechaInvoice}
              required
            />
            <Select
              label="Mes Facturado"
              data={months}
              value={mesFacturado}
              onChange={setMesFacturado}
              placeholder="Selecciona un mes"
              required
            />
            <TextInput
              label="Año Facturado"
              value={yearFacturado}
              onChange={(event) => setYearFacturado(event.currentTarget.value)}
              required
            />
            <Button onClick={descargarArchivo}>Descargar Archivo</Button>
          </Stack>
        </Paper>
      </AppShell.Main>
    </AppShell>
  );
}
