const puppeteer = require('puppeteer');

const generatePdf = async (data) => {
    const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ],
});
    const page = await browser.newPage();

    const { results, category, orders, ticket } = data;
    const formatARS = (val) => new Intl.NumberFormat("es-AR", { 
        style: "currency", currency: "ARS", maximumFractionDigits: 0 
    }).format(val || 0);

    const revenue = (orders || 0) * (ticket || 0);
    const lossPercentage = revenue > 0 ? ((results.totalLoss / revenue) * 100).toFixed(1) : "0.0";
    const annualLoss = results.totalLoss * 12;

    const content = `
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Plus Jakarta Sans', sans-serif; 
                background-color: #020617; color: #f8fafc; 
                padding: 40px; height: 100vh; display: flex; flex-direction: column;
                justify-content: space-between;
            }
            
            /* Header */
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
            .logo { font-weight: 800; font-size: 24px; color: #fff; }
            .logo span { color: #3b82f6; }
            .audit-tag { background: #1e293b; padding: 5px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #94a3b8; border: 1px solid #334155; }

            /* Hero Section */
            .hero { text-align: center; margin-top: 20px; }
            .hero h1 { font-size: 13px; color: #ef4444; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
            .main-loss { font-size: 72px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -2px; }
            .hero p { color: #64748b; font-size: 14px; margin-top: 10px; }

            /* Stats Grid */
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .stat-card { background: #0f172a; border: 1px solid #1e293b; padding: 25px; border-radius: 16px; position: relative; overflow: hidden; }
            .stat-card::after { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #ef4444; }
            .stat-card h3 { font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; }
            .stat-card .val { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 10px; }
            .stat-card p { font-size: 12px; color: #475569; line-height: 1.4; }

            /* Projections Table */
            .projections { background: #070a13; border-radius: 16px; padding: 25px; border: 1px solid #1e293b; }
            .projections h2 { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }
            .row:last-child { border: 0; padding-top: 20px; font-size: 22px; font-weight: 800; color: #ef4444; }
            .row span { color: #94a3b8; }

            /* Order360 Section - REMARCADO */
            .solution { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #3b82f6; padding: 30px; border-radius: 20px; }
            .solution-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
            .solution-header h2 { font-size: 16px; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; }
            
            .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .benefit { display: flex; gap: 12px; }
            .check { background: #3b82f6; color: #fff; min-width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
            .benefit div b { font-size: 14px; color: #fff; display: block; margin-bottom: 4px; }
            .benefit div p { font-size: 12px; color: #94a3b8; line-height: 1.4; }

            /* Footer Verdict */
            .verdict { border-left: 4px solid #ef4444; padding-left: 20px; }
            .verdict p { color: #94a3b8; font-size: 12px; line-height: 1.6; font-style: italic; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">Pedidos<span>360</span></div>
            <div class="audit-tag">AUDITORÍA CRÍTICA DE RENTABILIDAD</div>
        </div>

        <div class="hero">
            <h1>Pérdida Operativa Mensual</h1>
            <div class="main-loss">${formatARS(results.totalLoss)}</div>
            <p>Impacto directo sobre el flujo de caja de tu <b>${category}</b>.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Eficiencia de Ventas</h3>
                <div class="val">-${lossPercentage}%</div>
                <p>Cada venta manual diluye tu margen neto. Esta cifra representa el capital que se esfuma por errores de carga y falta de automatización.</p>
            </div>
            <div class="stat-card">
                <h3>Capacidad Perdida</h3>
                <div class="val">${results.totalHours.toFixed(0)}h</div>
                <p>Tiempo humano "quemado" en tareas repetitivas. Son ${results.totalHours.toFixed(0)} horas que podrías dedicar a escalar el negocio.</p>
            </div>
        </div>

        <div class="projections">
            <h2>Proyección de Descapitalización</h2>
            <div class="row"><span>Pérdida Semestral</span><b>${formatARS(results.totalLoss * 6)}</b></div>
            <div class="row"><span>Pérdida Anual</span><b>${formatARS(annualLoss)}</b></div>
            <div class="row"><span>Impacto a 5 años</span><b>${formatARS(annualLoss * 5)}</b></div>
        </div>

        <div class="solution">
            <div class="solution-header">
                <span style="font-size: 24px;">🚀</span>
                <h2>Plan de Recuperación: Pedidos360</h2>
            </div>
            <div class="benefits-grid">
                <div class="benefit">
                    <span class="check">✓</span>
                    <div>
                        <b>Blindaje de Ventas</b>
                        <p>Eliminás el error humano al 100% mediante la integración directa de pedidos.</p>
                    </div>
                </div>
                <div class="benefit">
                    <span class="check">✓</span>
                    <div>
                        <b>Automatización de Carga</b>
                        <p>Recuperás tus ${results.totalHours.toFixed(0)} horas mensuales de forma inmediata.</p>
                    </div>
                </div>
                <div class="benefit">
                    <span class="check">✓</span>
                    <div>
                        <b>Stock Inteligente</b>
                        <p>Sincronización en tiempo real para evitar quiebres de stock y ventas perdidas.</p>
                    </div>
                </div>
                <div class="benefit">
                    <span class="check">✓</span>
                    <div>
                        <b>Visibilidad Total</b>
                        <p>Reportes de rentabilidad automáticos para tomar decisiones basadas en datos.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="verdict">
            <p>"El costo de no hacer nada es, en este momento, tu mayor gasto operativo. La automatización no es un lujo, es la única forma de proteger tu margen en un mercado competitivo."</p>
        </div>
    </body>
    </html>
    `;

    await page.setContent(content, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
        format: 'A4', 
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    await browser.close();
    return pdf;
};

module.exports = generatePdf;