import transporter from '../mailConnection.js';

/**
 * Sends the signing invitation to the bedrijf HR contact.
 */
export async function sendContractToSign(hrEmail, signingUrl, studentNaam, bedrijfNaam) {
    const mailOptions = {
        from: '"Stage@EHB" <stageatehb@gmail.com>',
        to: hrEmail,
        subject: `Stagecontract ter ondertekening - ${studentNaam}`,
        text: `Geachte HR-verantwoordelijke,\n\nU ontvangt dit bericht omdat uw bedrijf (${bedrijfNaam}) een stagecontract dient te ondertekenen voor student ${studentNaam}.\n\nKlik op de volgende link om het document te bekijken en te ondertekenen:\n${signingUrl}\n\nMet vriendelijke groeten,\nStage@EHB`,
        html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stagecontract ter ondertekening</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#4A90E2 0%,#2c6fbd 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Stagecontract ter ondertekening</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 30px;">
            <p style="font-size:16px;line-height:1.6;color:#4A4A4A;margin:0 0 16px;">Geachte HR-verantwoordelijke,</p>
            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 24px;">
              U ontvangt dit bericht namens <strong>ErasmusHogeschool Brussel</strong>. Het bedrijf <strong>${bedrijfNaam}</strong> dient een stagecontract te ondertekenen voor:
            </p>

            <!-- Info box -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0f6ff;border-radius:6px;border:1px solid #cce0ff;margin-bottom:28px;">
              <tr>
                <td style="padding:20px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size:13px;color:#6b7280;font-weight:600;padding-bottom:8px;width:40%;">Student:</td>
                      <td style="font-size:14px;color:#1a202c;padding-bottom:8px;"><strong>${studentNaam}</strong></td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#6b7280;font-weight:600;">Bedrijf:</td>
                      <td style="font-size:14px;color:#1a202c;">${bedrijfNaam}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 28px;">
              Klik op de knop hieronder om het contract te bekijken en digitaal te ondertekenen. De link is eenmalig geldig.
            </p>

            <!-- CTA -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${signingUrl}" target="_blank"
                     style="background-color:#4A90E2;color:#fff;padding:15px 36px;font-size:16px;font-weight:700;text-decoration:none;border-radius:6px;display:inline-block;box-shadow:0 3px 8px rgba(74,144,226,0.35);">
                    Document ondertekenen
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:13px;color:#9ca3af;margin:0;line-height:1.5;">
              Werkt de knop niet? Kopieer en plak dan deze link in uw browser:<br>
              <a href="${signingUrl}" style="color:#4A90E2;word-break:break-all;">${signingUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#a0aec0;margin:0;">Dit is een automatische e-mail vanuit het Stage@EHB platform.</p>
            <p style="font-size:12px;color:#a0aec0;margin:5px 0 0;">&copy; 2026 Stage@EHB - ErasmusHogeschool Brussel.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Contract-mail verstuurd naar ${hrEmail} (${info.messageId})`);
    } catch (err) {
        console.error(`Fout bij versturen contract-mail naar ${hrEmail}:`, err);
        throw err;
    }
}

/**
 * Notifies the student that a document has been uploaded for them by the admin.
 */
export async function sendDocumentUploadedToStudent(studentEmail, studentNaam, bedrijfNaam) {
    const loginUrl = 'http://localhost:5173/login';
    const mailOptions = {
        from: '"Stage@EHB" <stageatehb@gmail.com>',
        to: studentEmail,
        subject: `Nieuw document te verwerken - ${bedrijfNaam}`,
        text: `Beste ${studentNaam},\n\nEr is een nieuw document klaargezet voor jouw stage bij ${bedrijfNaam}.\nLog in op het platform om het document te bekijken, in te vullen en opnieuw op te laden.\n\n${loginUrl}\n\nMet vriendelijke groeten,\nStage@EHB`,
        html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuw document te verwerken</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="background:linear-gradient(135deg,#4A90E2 0%,#2c6fbd 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Nieuw document beschikbaar</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 30px;">
            <p style="font-size:16px;line-height:1.6;color:#4A4A4A;margin:0 0 16px;">Beste ${studentNaam},</p>
            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 24px;">
              De administratie heeft een nieuw document klaargezet voor jouw stage bij <strong>${bedrijfNaam}</strong>.
            </p>
            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 28px;">
              Gelieve in te loggen op het stageplatform om het document te downloaden, in te vullen en nadien opnieuw op te laden.
            </p>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
              <tr>
                <td align="center">
                  <a href="${loginUrl}" target="_blank"
                     style="background-color:#4A90E2;color:#fff;padding:15px 36px;font-size:16px;font-weight:700;text-decoration:none;border-radius:6px;display:inline-block;box-shadow:0 3px 8px rgba(74,144,226,0.35);">
                    Ga naar platform
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#a0aec0;margin:0;">Dit is een automatische e-mail vanuit het Stage@EHB platform.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Student document notificatie verstuurd naar ${studentEmail} (${info.messageId})`);
    } catch (err) {
        console.error(`Fout bij versturen student notificatie naar ${studentEmail}:`, err);
        throw err;
    }
}

/**
 * Notifies the admin that a document has been signed by the bedrijf.
 */
export async function sendSignedNotification(adminEmail, studentNaam, bedrijfNaam, downloadUrl) {
    const mailOptions = {
        from: '"Stage@EHB" <stageatehb@gmail.com>',
        to: adminEmail,
        subject: `Contract ondertekend - ${studentNaam}`,
        text: `Het stagecontract voor ${studentNaam} (${bedrijfNaam}) werd zojuist ondertekend door het bedrijf.\n\nDownload het ondertekend document via:\n${downloadUrl}`,
        html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract ondertekend</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.05);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px 30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Contract ondertekend</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 30px;">
            <p style="font-size:16px;line-height:1.6;color:#4A4A4A;margin:0 0 16px;">Beste Admin,</p>
            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 24px;">
              Het stagecontract voor onderstaande student werd zojuist <strong>digitaal ondertekend</strong> door het bedrijf.
            </p>

            <!-- Info box -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdf4;border-radius:6px;border:1px solid #a7f3d0;margin-bottom:28px;">
              <tr>
                <td style="padding:20px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size:13px;color:#6b7280;font-weight:600;padding-bottom:8px;width:40%;">Student:</td>
                      <td style="font-size:14px;color:#1a202c;padding-bottom:8px;"><strong>${studentNaam}</strong></td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#6b7280;font-weight:600;padding-bottom:8px;">Bedrijf:</td>
                      <td style="font-size:14px;color:#1a202c;padding-bottom:8px;">${bedrijfNaam}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#6b7280;font-weight:600;">Ondertekend op:</td>
                      <td style="font-size:14px;color:#1a202c;">${new Date().toLocaleString('nl-BE')}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="font-size:15px;line-height:1.6;color:#4A4A4A;margin:0 0 28px;">
              U kunt het ondertekend contract downloaden via de knop hieronder of via het documenten-overzicht in de app.
            </p>

            <!-- CTA -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <a href="${downloadUrl}" target="_blank"
                     style="background-color:#10b981;color:#fff;padding:14px 32px;font-size:15px;font-weight:700;text-decoration:none;border-radius:6px;display:inline-block;box-shadow:0 3px 8px rgba(16,185,129,0.35);">
                    Download ondertekend contract
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#a0aec0;margin:0;">Dit is een automatische e-mail vanuit het Stage@EHB platform.</p>
            <p style="font-size:12px;color:#a0aec0;margin:5px 0 0;">&copy; 2026 Stage@EHB - ErasmusHogeschool Brussel.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Ondertekening-notificatie verstuurd naar admin (${info.messageId})`);
    } catch (err) {
        console.error(`Fout bij versturen notificatie naar admin:`, err);
        throw err;
    }
}
