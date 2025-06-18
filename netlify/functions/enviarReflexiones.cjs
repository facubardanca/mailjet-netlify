const mailjet = require('node-mailjet');

exports.handler = async function (event, context) {
  try {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: '',
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { respuesta1 = '', respuesta2 = '', respuesta3 = '' } = body;

    const texto = `
📩 Nuevo envío desde la página introspectiva:

🌀 ¿Qué parte de vos te trajo hasta acá?
${respuesta1}

🌱 ¿Qué sentís que podría revelarse si vivís esta experiencia?
${respuesta2}

🔓 ¿Hay algo que necesitás que yo sepa antes de abrir esta puerta con vos?
${respuesta3}
`;

    const mailjetClient = mailjet.connect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'no-responder@facubardanca.com',
              Name: 'Facu Web',
            },
            To: [
              {
                Email: 'facundobardanca@gmail.com',
                Name: 'Facu',
              },
            ],
            Subject: '🌀 Nueva respuesta introspectiva',
            TextPart: texto,
          },
        ],
      });

    const result = await request;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, response: result.body }),
    };
  } catch (err) {
    console.error("❌ Error en enviarReflexiones:", err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
