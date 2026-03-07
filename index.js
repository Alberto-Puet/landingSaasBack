require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json()); 

// IMPORTANTE: Asegurate de que en Render la variable se llame API_KEY_RESEND
const resend = new Resend(process.env.API_KEY_RESEND);

app.post("/welcome-email", async (req, res) => {
  const { email, category, results } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      // Usá el que tenías en la imagen si ya verificaste el dominio
      from: "Pedidos360 <diagnostico@pedidos360.com>", 
      to: email,
      subject: `🛡️ Tu Diagnóstico de Rentabilidad - Pedidos360`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1>¡Hola!</h1>
          <p>Analizamos el impacto económico de la gestión manual para tu <strong>${category}</strong>:</p>
          <p>Pérdida mensual: <strong>${results.totalLoss.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</strong></p>
          <p>Pérdida proyectada a 5 años: <strong>${results.fiveYearLoss.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</strong></p>
          <br>
          <p>Te avisaremos en cuanto la plataforma esté lista para ayudarte a optimizar tu rentabilidad.</p>
          <p>Saludos,<br>El equipo de <strong>Pedidos360</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Error de Resend:", error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ message: "Email enviado" });
  } catch (err) {
    console.error("Error servidor:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080; 
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Puerto: ${PORT}`));