require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const generatePdf = require('./pdf/server');

const app = express();
const resend = new Resend(process.env.API_KEY_RESEND);

app.use(cors());
app.use(express.json()); 

app.post('/generate-diagnostic', async (req, res) => {
    const { email, category } = req.body;
    console.log(`--- Procesando PDF para: ${email} ---`);

    try {
        const pdfRaw = await generatePdf(req.body);
        const pdfBuffer = Buffer.from(pdfRaw);

        console.log(`Tamaño del PDF generado: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

        const { data, error } = await resend.emails.send({
            from: 'Pedidos360 <diagnostico@pedidos360.com>', 
            to: [email],
            subject: '📈 Tu Diagnóstico de Rentabilidad - Pedidos360', 
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>¡Hola!</h2>
                    <p>Adjunto encontrarás el diagnóstico detallado para tu <strong>${category}</strong>.</p>
                    <p>Este informe muestra el impacto económico de la gestión manual de pedidos y cómo optimizar tu rentabilidad.</p>
                    <br />
                    <p>Saludos,<br />El equipo de <strong>Pedidos360</strong></p>
                </div>
            `,
            attachments: [
                {
                    filename: `Diagnostico_Pedidos360.pdf`, 
                    content: pdfBuffer,
                },
            ],
        });


        if (error) {
            console.error("Error de Resend:", error);
            return res.status(400).json(error);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("❌ Error en el proceso:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, "0.0.0.0", () => { 
    console.log(`🚀 SERVIDOR ESCUCHANDO EN EL PUERTO: ${PORT}`);
});