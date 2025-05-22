const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.handler = async function (event, context) {
  console.log("🔍 Probando conexión con Mailjet...");

  try {
    const result = await mailjet.get("user").request();
    console.log("✅ Conexión exitosa:", result.body);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ success: true, account: result.body })
    };
  } catch (err) {
    console.error("❌ Error al conectar con Mailjet:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://facubardanca.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
