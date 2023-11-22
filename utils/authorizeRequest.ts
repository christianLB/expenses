// utils/authorizeRequest.js
//import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";


async function authorizeRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  //if (!session && req.headers['x-api-key'] !== process.env.UI_API_KEY) {
  if (!session) {
    // Si no hay sesión y la clave API no es válida, arroja un error
    throw new Error("No autorizado");
  }

  // Retorna la sesión para uso adicional si es necesario
  return session;
}

export default authorizeRequest;
