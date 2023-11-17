// utils/authorizeRequest.js
import { getSession } from "next-auth/react";

async function authorizeRequest(req) {
  const session = await getSession({ req });

  if (!session && req.headers['x-api-key'] !== process.env.UI_API_KEY) {
    // Si no hay sesión y la clave API no es válida, arroja un error
    throw new Error("No autorizado");
  }

  // Retorna la sesión para uso adicional si es necesario
  return session;
}

export default authorizeRequest;
