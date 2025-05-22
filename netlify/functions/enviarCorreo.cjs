const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event) {
  // ✅ Manejo de preflight OPTIONS
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

  // ✅ Parseo del body real
  const { energiav, sueno, historia, dia, email } = JSON.parse(event.body || "{}");

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
        "Access-Control-Allow-Origin": "*", // podés limitar a tu dominio si querés
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: "✅ CORREO ENVIADO CON ÉXITO"
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
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: `❌ ERROR REAL DETECTADO:\n${full}`
    };
  }
};
