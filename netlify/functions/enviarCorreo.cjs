const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event, context) {
  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "privado@facubardanca.com",
            Name: "Facu Bardanca Web"
          },
          To: [
            {
              Email: "facundobardanca@gmail.com",
              Name: "Facundo"
            }
          ],
          Subject: "Test directo de envío Mailjet",
          TextPart: "Este es un mensaje de prueba enviado directamente desde Netlify sin ningún campo dinámico. Si ves esto, Mailjet está funcionando bien."
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


