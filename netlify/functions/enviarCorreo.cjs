const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: ""
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "No data provided" })
    };
  }

  const data = JSON.parse(event.body);
  const { vital, sueno, historia, dia, email } = data;

  const message = [
    "✉️ Nueva respuesta desde la web:",
    "",
    `🔋 Energía deseada: ${vital}`,
    `🌌 Sueño profundo: ${sueno}`,
    `📖 Historia personal: ${historia}`,
    `📅 Día perfecto: ${dia}`,
    `📩 Email del usuario: ${email}`
  ].join('\n');

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "privado@facubardanca.com",
            Name: "Llegó una experiencia para crear Facu."
          },
          To: [
            {
              Email: "facundobardanca@gmail.com",
              Name: "Facundo"
            }
          ],
          Subject: "Tenés una nueva experiencia para crear Facu. Ya sos.",
          TextPart: message
        }
      ]
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    const mensaje = err?.message || "Error desconocido";
    const detalle = err?.response?.res?.statusMessage || "";
    const full = `${mensaje} — ${detalle}`.trim();

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: full })
    };
  }
};

