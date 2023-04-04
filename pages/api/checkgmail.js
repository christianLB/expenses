// import { google } from "googleapis";
// //import { serialize } from "cookie";
// import { NextApiResponse, NextApiRequest } from "next";

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/auth`
// );

// const setTokenCookie = (res, token) => {
//   res.setHeader(
//     "Set-Cookie",
//     serialize("token", JSON.stringify(token), {
//       maxAge: 30 * 24 * 60 * 60, // 30 days
//       path: "/",
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//     })
//   );
// };

// const getRouteHandler = async (req, res) => {
//   if (req.query.code) {
//     try {
//       const { tokens } = await oauth2Client.getToken(req.query.code);
//       oauth2Client.setCredentials(tokens);
//       setTokenCookie(res, tokens);
//       res.redirect("/");
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error fetching access token" });
//       return;
//     }
//   } else {
//     const authUrl = oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: ["https://www.googleapis.com/auth/gmail.readonly"],
//     });
//     res.redirect(authUrl);
//   }
// };

// const postRouteHandler = async (req, res) => {
//   const token = req.cookies.token;

//   if (!token) {
//     res.status(401).json({ error: "Unauthorized, please log in" });
//     return;
//   }

//   oauth2Client.setCredentials(JSON.parse(token));

//   const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//   try {
//     const { data } = await gmail.users.messages.list({
//       userId: "me",
//       labelIds: ["INBOX"],
//       maxResults: 10,
//     });
//     const messages = await Promise.all(
//       data.messages.map(async (message) => {
//         const messageData = await gmail.users.messages.get({
//           userId: "me",
//           id: message.id,
//           format: "metadata",
//           metadataHeaders: ["subject", "from", "to", "date"],
//         });

//         return messageData.data;
//       })
//     );

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching messages" });
//   }
// };

// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     await getRouteHandler(req, res);
//   } else if (req.method === "POST") {
//     await postRouteHandler(req, res);
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//   }
// }
