// send-test.js
import transporter from '../mailConnection.js';
// Dynamic mail functie op basis van jouw ROLES enum
async function createActivationMail(userEmail, userName, userPassword, role) {
    let roleText = '';
    let dashboardText = 'het platform';
    let subjectText = 'Jouw account is geactiveerd!';

    // Dynamische content bepalen op basis van de rol
    switch(role) {
        case 'ADMIN': // of ROLES.ADMIN afhankelijk van hoe de string matcht
            roleText = 'Jouw Administrator-account is succesvol aangemaakt en geactiveerd.';
            dashboardText = 'het Admin Dashboard';
            subjectText = 'Jouw Admin-account is geactiveerd!';
            break;
        case 'DOCENT':
            roleText = 'Jouw Docenten-account is succesvol aangemaakt en geactiveerd.';
            dashboardText = 'het Docenten Portaal';
            subjectText = 'Jouw Docenten-account is geactiveerd!';
            break;
        case 'STAGECOMMISIE':
            roleText = 'Jouw account voor de Stagecommissie is succesvol aangemaakt en geactiveerd.';
            dashboardText = 'het Commissie Dashboard';
            subjectText = 'Jouw Stagecommissie-account is geactiveerd!';
            break;
        case 'STAGEMENTOR':
            roleText = 'Jouw Mentor-account is succesvol aangemaakt en geactiveerd.';
            dashboardText = 'het Mentor Dashboard';
            subjectText = 'Jouw Mentor-account is geactiveerd!';
            break;
        case 'STUDENT':
            roleText = 'Jouw Student-account is succesvol aangemaakt en klaar voor gebruik.';
            dashboardText = 'het Student Dashboard';
            subjectText = 'Welkom bij Stage@EHB! Je account is aangemaakt';
            break;
        default:
            roleText = 'Jouw account is succesvol aangemaakt en geactiveerd.';
            dashboardText = 'het platform';
    }

    const mailOptions = {
        from: '"Stage@EHB" <stageatehb@gmail.com>',
        to: userEmail,
        subject: subjectText,
        text: `Hallo ${userName}! ${roleText} Jouw wachtwoord is: ${userPassword}. Je kan inloggen via de website.`, // Fallback
        html: `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welkom bij Stage@EHB</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            color: #333333;
            -webkit-font-smoothing: antialiased;
        }
        table {
            border-collapse: collapse;
        }
        td {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td style="background-color: #4A90E2; padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Account Geactiveerd!</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 16px; line-height: 1.6; color: #4A4A4A; margin: 0 0 20px 0;">
                                Beste <strong>${userName}</strong>,
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #4A4A4A; margin: 0 0 30px 0;">
                                ${roleText} Je kunt vanaf nu inloggen op het Stage@EHB platform om toegang te krijgen tot jouw gepersonaliseerde omgeving.
                            </p>

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 6px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="30%" style="font-size: 14px; color: #718096; padding-bottom: 10px; font-weight: bold;">E-mailadres:</td>
                                                <td style="font-size: 14px; color: #1a202c; padding-bottom: 10px;">${userEmail}</td>
                                            </tr>
                                            <tr>
                                                <td width="30%" style="font-size: 14px; color: #718096; font-weight: bold;">Wachtwoord:</td>
                                                <td style="font-size: 14px; color: #1a202c; font-family: monospace; font-size: 15px; background-color: #edf2f7; padding: 2px 6px; border-radius: 4px;">${userPassword}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="http://10.2.160.244/" target="_blank" style="background-color: #4A90E2; color: #ffffff; padding: 14px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block; box-shadow: 0 2px 5px rgba(74,144,226,0.3);">
                                            Naar ${dashboardText}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 14px; line-height: 1.5; color: #718096; margin: 0 0 10px 0;">
                                <em>Tip: We raden je aan om na de eerste keer inloggen direct jouw tijdelijke wachtwoord te wijzigen via je profielinstellingen.</em>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="font-size: 12px; color: #a0aec0; margin: 0;">
                                Dit is een automatische e-mail vanuit het Stage@EHB platform.
                            </p>
                            <p style="font-size: 12px; color: #a0aec0; margin: 5px 0 0 0;">
                                &copy; 2026 Stage@EHB. Alle rechten voorbehouden.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail succesvol verzonden naar rol: ${role}`);
        console.log('Bericht ID:', info.messageId);
    } catch (error) {
        console.error(`Er is iets misgegaan bij het verzenden naar ${role}:`, error);
    }
}
export default createActivationMail;