const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

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

  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
