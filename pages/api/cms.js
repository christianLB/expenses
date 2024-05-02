export const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
export const headers = {
  "Content-Type": "application/json",
  Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
};

export const getItem = async (collection, id) => {
  const response = await fetch(`${CMS_URL}/${collection}/${id}`, {
    method: "GET",
    headers,
  });
  return response.json();
};

export const getItems = async (collection, queryString, limit = 0, sort) => {
  const response = await fetch(
    `${CMS_URL}/${collection}?limit=${limit}${sort ? `&sort=${sort}` : ""}${queryString ? `&${queryString}` : ""
    }`,
    {
      method: "GET",
      headers,
    }
  );
  return response.json();
};

export const createItem = async (collection, data) => {
  const response = await fetch(`${CMS_URL}/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateItem = async (collection, id, data) => {
  const response = await fetch(`${CMS_URL}/${collection}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteItem = async (collection, id) => {
  const response = await fetch(`${CMS_URL}/${collection}/${id}`, {
    method: "DELETE",
    headers,
  });
  return response.json();
};
