/**
 * Centralized Strapi API endpoint
 * Handles all Strapi operations using JWT authentication
 */

import { getAuthHeaders, clearJWT } from '../../lib/strapi-auth';

const strapiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL
};

// Helper to handle Strapi errors
const handleStrapiError = (error) => {
  console.error('Strapi error:', error);
  const message = error.error?.message ||
    error.message?.message ||
    error.message ||
    'An error occurred';
  return {
    error: true,
    message,
    details: error
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: true, message: "Method not allowed" });
  }

  const { method, collection, id, data, query } = req.body;

  if (!collection) {
    return res.status(400).json({ error: true, message: "Collection is required" });
  }

  try {
    let response;
    const baseUrl = `${strapiConfig.baseUrl}/api/${collection}`;

    for (let attempt = 0; attempt < 2; attempt++) {
      const headers = await getAuthHeaders();
      const requestConfig = { headers, method };

      let url = id ? `${baseUrl}/${id}` : baseUrl;

      // ✅ Solución: Convertimos `query` a una cadena de parámetros de URL
      if (query && Object.keys(query).length > 0) {
        const queryString = new URLSearchParams(query).toString();
        url += `?${queryString}`;
      }

      console.log("📡 Strapi request:", { url, method, query });

      if (["POST", "PUT"].includes(method)) {
        if (!data) {
          return res.status(400).json({
            error: true,
            message: `Data is required for ${method}`,
          });
        }
        requestConfig.body = JSON.stringify({ data });
      }

      response = await fetch(url, requestConfig);
      console.log("📡 Strapi response status:", response.status);

      let result = null;
      if (response.status !== 204) {
        result = await response.json();
      }

      if (response.status === 401 && attempt === 0) {
        console.log("🔑 Auth failed, retrying...");
        clearJWT();
        continue;
      }

      if (!response.ok) {
        return res.status(response.status).json({
          error: true,
          message: result?.error?.message || "An error occurred",
        });
      }

      return res.status(200).json(result || {});
    }

    throw new Error("Authentication failed after retry");
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error", details: error });
  }
}

