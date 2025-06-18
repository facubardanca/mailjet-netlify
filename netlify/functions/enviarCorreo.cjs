const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: "Preflight OK"
    };
  }

  let energiav = "", sueno = "", historia = "", dia = "", email = "";

  try {
    const data = JSON.parse(event.body || "{}");
    energiav = data.energiav || "";
    sueno = data.sueno || "";
    historia = data.historia || "";
    dia = data.dia || "";
    email = data.email?.trim() || "";
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: false, error: "Body inválido" })
    };
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #111;">
      <h2 style="margin-bottom: 12px;">🌀 Nuevo formulario completado</h2>

      <p style="margin: 0 0 8px;"><strong>🔋 Energía deseada:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 10px;">${energiav}</p>

      <p style="margin: 20px 0 8px;"><strong>🌌 Recuerdo:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 10px;">${sueno}</p>

      <p style="margin: 20px 0 8px;"><strong>📖 Creencia:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 10px;">${historia}</p>

      <p style="margin: 20px 0 8px;"><strong>📅 Escena:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 10px;">${dia}</p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;">

      <p style="font-size: 13px;"><strong>📩 Email del usuario:</strong> ${email}</p>
      <p style="font-size: 12px; color: #666;">Este mensaje fue enviado automáticamente desde la web principal.</p>
    </div>
  `;

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
          Subject: "🌀 Nuevo formulario completado",
          HTMLPart: html
        }
      ]
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    const message = err?.message || "Error desconocido";
    const status = err?.statusCode || "Sin código";
    const mailjetMsg = err?.response?.res?.statusMessage || "";
    const full = `${message} — ${status} — ${mailjetMsg}`.trim();

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: false, error: full })
    };
  }
};
