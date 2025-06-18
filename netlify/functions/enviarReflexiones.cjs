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
    const { nombre = '', respuesta1 = '', respuesta2 = '', respuesta3 = '' } = body;

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
              Email: 'privado@facubardanca.com',
              Name: 'Nueva respuesta [Formulario Vibracional]',
            },
            To: [
              {
                Email: 'facundobardanca@gmail.com',
                Name: 'Facu',
              },
            ],
            Subject: '🌀 Nueva respuesta introspectiva',
            HTMLPart: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #111;">
                <h2 style="margin-bottom: 8px;">🌀 Nueva respuesta introspectiva</h2>

                <p style="margin: 0 0 16px;"><strong>👤 Nombre:</strong><br>${nombre}</p>

                <hr style="border: none; border-top: 1px solid #ccc; margin: 24px 0;">

                <p style="margin: 0 0 8px;"><strong>🧩 ¿Qué parte de vos te trajo hasta acá?</strong></p>
                <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 12px; border-radius: 8px;">${respuesta1}</p>

                <p style="margin: 24px 0 8px;"><strong>🌱 ¿Qué sentís que podría revelarse si vivís esta experiencia?</strong></p>
                <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 12px; border-radius: 8px;">${respuesta2}</p>

                <p style="margin: 24px 0 8px;"><strong>🔓 ¿Hay algo que necesitás que yo sepa antes de abrir esta puerta con vos?</strong></p>
                <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 12px; border-radius: 8px;">${respuesta3}</p>

                <hr style="border: none; border-top: 1px solid #ccc; margin: 32px 0 12px;">

                <p style="font-size: 14px; color: #666;">📬 Este mensaje fue enviado automáticamente desde la web del formulario vibracional.</p>
              </div>
            `,
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
