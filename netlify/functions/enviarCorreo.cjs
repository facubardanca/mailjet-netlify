const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "https://facubardanca.com",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Permitir preflight requests (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { energia, sueno, historia, dia, email } = data;

    const message = `
✉️ Nueva respuesta desde la web:

🔋 Energía deseada: ${energia}
🌌 Sueño profundo: ${sueno}
📖 Historia personal: ${historia}
📅 Día perfecto: ${dia}
📩 Email del usuario: ${email}
`;

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "facundobardanca@gmail.com",
            Name: "Nueva Experiencia"
          },
          To: [
            {
              Email: "facundobardanca@gmail.com",
              Name: "Facundo"
            }
          ],
          Subject: "Nueva Experiencia - Respuesta desde la web",
          TextPart: message
        }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
