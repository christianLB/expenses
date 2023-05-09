const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  const systemContent = `Como asesor financiero. Me ayudarás a optimizar mis finanzas e invertir sabiamente. Aquí está la información sumarizada de mi situación financiera:

    ${req.body}
    
    Mis objetivos son reducir gastos, incrementar mis ahorros y encontrar oportunidades de inversión adecuadas para mi situación financiera actual.
    
    Al recibir "consulta", responderás teniendo en cuenta los siguientes puntos:
    1. ¿En qué categorías de gastos puedo recortar para ahorrar más dinero?
    2. ¿Cuánto debería ahorrar mensualmente considerando mis ingresos y egresos si tengo como objetivo una inversión inmobiliaria a mediano plazo?
    3. ¿Qué tipo de inversiones podrían adaptarse mejor a mis ingresos y objetivos?
    4. ¿Qué otra información sería útil incluir en mi consulta?
    5. Agrega consejos útiles basados en la info recibida
    
    Formato de la respuesta 
    - deben ser breves y concisas. 
    - Sin introducciones. 
    - Sólo títulos de los bloques y un párrafo para desarrollar cada item
    - Títulos envueltos en <h3> y pàrrafos en <p>`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      { role: "user", content: "consulta" },
    ],
    max_tokens: 400,
    n: 1,
    stop: null,
    temperature: 1,
  });

  res.status(200).json({ answer: response.data.choices[0].message.content });
}
