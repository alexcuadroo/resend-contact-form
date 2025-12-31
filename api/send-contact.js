// Variables de entorno desde .env
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Contacto <onboarding@resend.dev>';
const TO_EMAIL = process.env.TO_EMAIL;

module.exports = async function handler(req, res) {
  if (!RESEND_API_KEY) {
    return res.status(500).json({
      error: 'RESEND_API_KEY no está configurada en las variables de entorno'
    });
  }

  if (!TO_EMAIL) {
    return res.status(500).json({
      error: 'TO_EMAIL no está configurada en las variables de entorno'
    });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email no válido'
      });
    }

    // Sanitización básica para prevenir inyección de HTML
    const sanitize = (str) => str.replace(/[&<>"']/g, (m) => ({ 
      '&': '&amp;', 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#39;' 
    })[m]);

    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeMessage = sanitize(message);

    const emailContent = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Nuevo mensaje de ${safeName} a través del formulario de contacto`,
      html: `<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Nuevo Mensaje de Contacto</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 0px !important;
            }
            .header-content {
                padding: 30px 20px !important;
            }
            .text-content {
                font-size: 15px !important;
            }
            .message-box {
                padding: 20px !important;
            }
            h1 {
                font-size: 24px !important;
            }
        }
        
        body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        }
        
        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
        }
        
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background: #F0F8FF; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; padding: 10px 10px;">
        <tr>
            <td align="center">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; width: 100%; background: #ffffff; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td class="header-content" style="padding: 0px; background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%); position: relative; text-align: center;">
                            <div style="position: relative; z-index: 2;">
                                <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; padding: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 8L10.89 13.26C11.5 13.67 12.5 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">¡Nuevo Mensaje Recibido!</h1>
                                <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px; font-weight: 400;">Alguien te ha contactado desde tu sitio web</p>
                            </div>
                            <div style="position: absolute; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.1); top: -50px; right: -50px;"></div>
                            <div style="position: absolute; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.1); bottom: -30px; left: -30px;"></div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="content" style="padding: 40px;">
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #F0F8FF 0%, #e0f0ff 100%); padding: 30px; border-radius: 12px; border: 1px solid rgba(0, 119, 182, 0.1); box-shadow: 0 4px 12px rgba(0, 119, 182, 0.08);">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <h2 style="color: #0077B6; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center;">
                                                        <span style="display: inline-block; width: 4px; height: 18px; background: #0077B6; margin-right: 10px; border-radius: 2px;"></span>
                                                        Información del Remitente
                                                    </h2>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0; border-bottom: 1px solid rgba(0, 119, 182, 0.1);">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                            <td style="vertical-align: middle;">
                                                                <p style="margin: 0 0 4px 0; color: #4b5563; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</p>
                                                                <p style="margin: 0; color: #1f2937; font-size: 17px; font-weight: 600;">${safeName}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0 0 0;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M3 8L10.89 13.26C11.5 13.67 12.5 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                            <td style="vertical-align: middle;">
                                                                <p style="margin: 0 0 4px 0; color: #4b5563; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                                                <a href="mailto:${safeEmail}" style="margin: 0; color: #0077B6; font-size: 17px; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s ease;">${safeEmail}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td class="message-box" style="background: #ffffff; padding: 30px; border-radius: 12px; border: 2px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                                        <h2 style="color: #0077B6; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                            <span style="display: inline-block; width: 4px; height: 18px; background: #0077B6; margin-right: 10px; border-radius: 2px; vertical-align: middle;"></span>
                                            Mensaje
                                        </h2>
                                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #0077B6;">
                                            <div class="text-content" style="color: #374151; line-height: 1.8; font-size: 16px; word-wrap: break-word; font-weight: 400;">${safeMessage.replace(/\n/g, '<br>')}</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="mailto:${safeEmail}" style="display: inline-block; background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 119, 182, 0.4); transition: all 0.3s ease;">
                                            Responder Mensaje
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #F0F8FF 0%, #e0f0ff 100%); padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #e5e7eb;">
                                        <p style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px; line-height: 1.6; font-weight: 500;">
                                            📬 Mensaje enviado desde el formulario de contacto
                                        </p>
                                        <p style="margin: 0; color: #9ca3af; font-size: 13px; font-weight: 400;">
                                            🕒 ${new Date().toLocaleString('es-UY', {
        timeZone: 'America/Montevideo',
        dateStyle: 'full',
        timeStyle: 'short'
      })}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background: #03045E; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">   
                                Este es un correo automático.
                            </p>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © ${new Date().getFullYear()} Todos los derechos reservados
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
      text: `
Nuevo Mensaje de tu sección de Contacto

Nombre: ${safeName}
Email: ${safeEmail}

Mensaje:
${safeMessage}

Fecha: ${new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' })}
      `
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Resend:', errorData);

      return res.status(500).json({
        error: 'Error al enviar el email. Intenta nuevamente.'
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      id: data.id
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}