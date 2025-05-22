const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event) {
  // ✅ Manejo de preflight CORS
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

  // ✅ Parsear datos reales
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

  const text = [
    
    `🔋 Energía deseada: ${energiav}`,
    
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
            Name: "Facu Bardanca Web"
          },
          To: [
            {
              Email: "facundobardanca@gmail.com",
              Name: "Facundo"
            }
          ],
          Subject: "🌀 Nuevo formulario completado",
          TextPart: text
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
