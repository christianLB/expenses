import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const authorizeRequest = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  console.log("tuvijea");
  //if (!session && req.headers['x-api-key'] !== process.env.UI_API_KEY) {
  //console.log("CHEEE SESSION", session);
  if (!session) {
    // Si no hay sesión y la clave API no es válida, arroja un error
    throw new Error("No autorizado");
  }

  // Retorna la sesión para uso adicional si es necesario
  return session;
};

async function handler(req, res) {
  try {
    await authorizeRequest(req, res);
    //res.status(200).json({ data: "authorized" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export default handler;
