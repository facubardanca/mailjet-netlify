const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function () {
  const vital = "ejemplo de vital";
  const sueno = "sueño de prueba";
  const historia = "historia de prueba";
  const dia = "día perfecto de prueba";
  const email = "facundobardanca@gmail.com";

  const text = [
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
            Name: "Facu Bardanca Web"
          },
          To: [
            {
              Email: "facundobardanca@gmail.com",
              Name: "Facundo"
            }
          ],
          Subject: "🌀 Test forzado con formato real",
          TextPart: text
        }
      ]
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: "✅ CORREO ENVIADO CON ÉXITO"
    };
  } catch (err) {
    const message = err?.message || "Error desconocido";
    const status = err?.statusCode || "Sin código";
    const mailjetMsg = err?.response?.res?.statusMessage || "";
    const full = `${message} — ${status} — ${mailjetMsg}`.trim();

    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `❌ ERROR REAL DETECTADO:\n${full}`
    };
  }
};
