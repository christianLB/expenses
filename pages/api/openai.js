import { OpenAI } from "openai-streams";

export default async function handler(req, res) {
  const stream = await OpenAI("completions", {
    model: "text-davinci-003",
    prompt: req.body,
    max_tokens: 25,
  });

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};
