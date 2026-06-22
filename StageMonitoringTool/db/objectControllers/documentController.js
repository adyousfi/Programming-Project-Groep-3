import StageDocument from "../objectModel/stageDocument.js";
import Stage from "../objectModel/stage.js";
import Student from "../userModel/student.js";
import User from "../userModel/user.js";
import Bedrijf from "../objectModel/bedrijf.js";
import Admin from "../userModel/admin.js";
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { sendContractToSign, sendSignedNotification, sendDocumentUploadedToStudent } from '../../mailBot/sendMail/contractMail.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// ─── Existing handlers ──────────────────────────────────────────────────────

export const adminUploadDocument = async (req, res, next) => {
  try {
    const cookieUser = req.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const { stage_id } = req.body;
    if (!stage_id || !req.file) return res.status(400).json({ msg: 'stage_id en bestand zijn verplicht' });
    
    const doc = await StageDocument.create({
      stage_id: parseInt(stage_id),
      type: 'admin_template',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
    });

    const stage = await Stage.findByPk(parseInt(stage_id), {
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
      ],
    });

    if (stage) {
      const studentNaam = stage.student?.User ? `${stage.student.User.first_name} ${stage.student.User.last_name}` : 'Student';
      const studentEmail = stage.student?.User?.email;
      const bedrijfNaam = stage.bedrijf?.naam || 'Bedrijf';
      if (studentEmail) {
        await sendDocumentUploadedToStudent(studentEmail, studentNaam, bedrijfNaam);
      }
    }

    return res.status(201).json({ msg: 'Document geupload', document_id: doc.document_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij uploaden' });
  }
};

export const studentUploadDocument = async (req, res, next) => {
  try {
    const cookieUser = req.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const student = await Student.findByPk(cookieUser.user_id);
    if (!student) return res.status(404).json({ msg: 'Geen student gevonden' });
    const stage = await Stage.findOne({
      where: {
        student_id: cookieUser.user_id,
        createdAt: { [Op.gte]: student.createdAt }
      },
      order: [['createdAt', 'DESC']]
    });
    if (!stage) return res.status(404).json({ msg: 'Geen stage gevonden' });
    if (!req.file) return res.status(400).json({ msg: 'Bestand is verplicht' });
    const doc = await StageDocument.create({
      stage_id: stage.stage_id,
      type: 'student_submission',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
    });
    await stage.update({ status: 'DOCUMENTGEUPLOADED', document_validated: false });
    return res.status(201).json({ msg: 'Document ingediend', document_id: doc.document_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij uploaden' });
  }
};

export const getMyDocuments = async (req, res, next) => {
  try {
    const cookieUser = req.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const student = await Student.findByPk(cookieUser.user_id);
    if (!student) return res.json([]);
    const stage = await Stage.findOne({
      where: {
        student_id: cookieUser.user_id,
        createdAt: { [Op.gte]: student.createdAt }
      },
      order: [['createdAt', 'DESC']]
    });
    if (!stage) return res.json([]);
    const docs = await StageDocument.findAll({
      where: { stage_id: stage.stage_id },
      order: [['createdAt', 'DESC']],
    });
    return res.json(docs.map(d => ({
      id: d.document_id,
      type: d.type,
      name: d.original_name,
      datum: new Date(d.createdAt).toLocaleDateString('nl-BE'),
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen documenten' });
  }
};

export const getStageDocuments = async (req, res, next) => {
  try {
    const docs = await StageDocument.findAll({
      where: { stage_id: req.params.stageId },
      order: [['createdAt', 'DESC']],
    });
    return res.json(docs.map(d => ({
      id: d.document_id,
      type: d.type,
      name: d.original_name,
      datum: new Date(d.createdAt).toLocaleDateString('nl-BE'),
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen documenten' });
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const doc = await StageDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document niet gevonden' });
    const filePath = path.join(uploadsDir, doc.stored_name);
    if (!fs.existsSync(filePath)) return res.status(404).json({ msg: 'Bestand niet gevonden op server' });
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij downloaden' });
  }
};

export const downloadDocumentByToken = async (req, res, next) => {
  try {
    const doc = await StageDocument.findOne({
      where: { signing_token: req.params.token }
    });
    if (!doc) return res.status(404).send('Document niet gevonden of ongeldige token');
    const filePath = path.join(uploadsDir, doc.stored_name);
    if (!fs.existsSync(filePath)) return res.status(404).send('Bestand niet gevonden op server');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Fout bij downloaden');
  }
};

// ─── New: Bedrijf contract signing flow ─────────────────────────────────────

/**
 * POST /api/documents/send-contract
 * Admin uploads a PDF and sends it to the bedrijf HR for signing.
 */
export const sendContractToBedrijf = async (req, res, next) => {
  try {
    const cookieUser = req.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

    const { stage_id } = req.body;
    if (!stage_id || !req.file) {
      return res.status(400).json({ msg: 'stage_id en een PDF-bestand zijn verplicht' });
    }

    // Load stage info for the email
    const stage = await Stage.findByPk(parseInt(stage_id), {
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
      ],
    });
    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

    const studentNaam = stage.student?.User
      ? `${stage.student.User.first_name} ${stage.student.User.last_name}`
      : 'Student';
    const bedrijfNaam = stage.bedrijf?.naam || 'Bedrijf';
    const bedrijf_email = stage.bedrijf?.hr_email;
    if (!bedrijf_email) {
      return res.status(400).json({ msg: 'Bedrijf heeft geen HR e-mailadres ingesteld.' });
    }

    // Generate unique signing token
    const token = uuidv4();

    // Save document record
    await StageDocument.create({
      stage_id: parseInt(stage_id),
      type: 'contract_unsigned',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
      signing_token: token,
    });

    // Build signing URL (served by Express directly)
    const signingUrl = `http://localhost:3000/api/documents/sign/${token}`;

    // Send mail to bedrijf HR
    await sendContractToSign(bedrijf_email, signingUrl, studentNaam, bedrijfNaam);

    return res.status(201).json({ msg: 'Contract verstuurd naar bedrijf voor ondertekening' });
  } catch (err) {
    console.error('Fout bij versturen contract:', err);
    return res.status(500).json({ msg: 'Fout bij versturen contract' });
  }
};

/**
 * GET /api/documents/sign/:token
 * Returns a self-contained HTML signing page (no auth required — token-based).
 * Includes a download link so the bedrijf can review the PDF before signing.
 */
export const getSigningPage = async (req, res, next) => {
  try {
    const doc = await StageDocument.findOne({
      where: { signing_token: req.params.token, type: 'contract_unsigned' },
      include: [
        {
          model: Stage, as: 'stage',
          include: [
            { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
            { model: Bedrijf, as: 'bedrijf' },
          ]
        }
      ]
    });

    if (!doc) {
      return res.status(404).send(`<!DOCTYPE html><html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f4f6f8;">
        <div style="text-align:center;background:#fff;padding:48px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
          <h2 style="color:#ef4444;margin:0 0 12px;">Ongeldige of verlopen link</h2>
          <p style="color:#6b7280;margin:0;">Dit document bestaat niet of werd al ondertekend.</p>
        </div></body></html>`);
    }

    // Check already signed
    const alreadySigned = await StageDocument.findOne({
      where: { stage_id: doc.stage_id, type: 'contract_signed' }
    });
    if (alreadySigned) {
      return res.status(410).send(`<!DOCTYPE html><html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f4f6f8;">
        <div style="text-align:center;background:#fff;padding:48px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
          <h2 style="color:#10b981;margin:0 0 12px;">Document al ondertekend</h2>
          <p style="color:#6b7280;margin:0;">Dit contract werd reeds ondertekend. U hoeft niets meer te doen.</p>
        </div></body></html>`);
    }

    const studentNaam = doc.stage?.student?.User
      ? `${doc.stage.student.User.first_name} ${doc.stage.student.User.last_name}`
      : 'Student';
    const bedrijfNaam = doc.stage?.bedrijf?.naam || 'Bedrijf';
    const token = req.params.token;
    const downloadUrl = `/api/documents/download-token/${token}`;

    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract ondertekenen - Stage@EHB</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-width: 640px;
      width: 100%;
      overflow: hidden;
    }
    .card-header {
      background: linear-gradient(135deg, #4A90E2, #2c6fbd);
      padding: 32px 36px;
      text-align: center;
    }
    .card-header h1 {
      color: #fff; margin: 0; font-size: 22px; font-weight: 700;
    }
    .card-header p {
      color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;
    }
    .card-body { padding: 32px 36px; }
    .info-box {
      background: #f0f6ff;
      border: 1px solid #cce0ff;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .info-box p { margin: 0 0 6px; font-size: 14px; color: #374151; }
    .info-box p:last-child { margin: 0; }
    .info-box strong { color: #1e40af; }
    .download-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: center;
    }
    .download-section p {
      margin: 0 0 12px; font-size: 14px; color: #4a5568;
    }
    .btn-download {
      display: inline-block;
      background: linear-gradient(135deg, #4A90E2, #2c6fbd);
      color: #fff; padding: 10px 24px;
      font-size: 14px; font-weight: 600;
      text-decoration: none; border-radius: 6px;
      transition: all 0.2s;
    }
    .btn-download:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74,144,226,0.35);
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
    }
    .canvas-wrapper {
      border: 2px dashed #d1d5db;
      border-radius: 10px;
      background: #fafafa;
      cursor: crosshair;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .canvas-wrapper:hover { border-color: #4A90E2; }
    #sig-canvas {
      display: block;
      width: 100%;
      touch-action: none;
    }
    .canvas-placeholder {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #9ca3af; font-size: 14px; pointer-events: none;
      text-align: center; transition: opacity 0.2s;
    }
    .btn-row {
      display: flex; gap: 12px; margin-top: 20px;
    }
    .btn {
      flex: 1; padding: 13px 20px; border: none; border-radius: 8px;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: all 0.2s; letter-spacing: 0.3px;
    }
    .btn-clear {
      background: #f3f4f6; color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-clear:hover { background: #e5e7eb; }
    .btn-submit {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff; box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    }
    .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(16,185,129,0.4); }
    .btn-submit:disabled { background: #d1d5db; color: #9ca3af; box-shadow: none; transform: none; cursor: not-allowed; }
    .legal {
      font-size: 12px; color: #9ca3af; margin-top: 20px; line-height: 1.6; text-align: center;
    }
    #result-screen {
      display: none; text-align: center; padding: 32px 36px 48px;
    }
    #result-screen h2 { color: #10b981; font-size: 24px; margin: 16px 0 12px; }
    #result-screen p { color: #6b7280; margin: 0; line-height: 1.6; }
    #error-msg { color: #ef4444; font-size: 13px; margin-top: 10px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <!-- Signing form -->
    <div id="sign-screen">
      <div class="card-header">
        <h1>Stagecontract ondertekenen</h1>
        <p>ErasmusHogeschool Brussel - Stage@EHB</p>
      </div>
      <div class="card-body">
        <div class="info-box">
          <p>Student: <strong>${studentNaam}</strong></p>
          <p>Bedrijf: <strong>${bedrijfNaam}</strong></p>
          <p>Document: <strong>${doc.original_name}</strong></p>
        </div>

        <div class="download-section">
          <p>Bekijk het contract voordat u ondertekent:</p>
          <a href="${downloadUrl}" class="btn-download" target="_blank" rel="noopener">
            Document bekijken / downloaden
          </a>
        </div>

        <label for="sig-canvas">Uw handtekening (teken hieronder met muis of vinger):</label>
        <div class="canvas-wrapper" id="canvas-wrapper">
          <canvas id="sig-canvas" width="600" height="200"></canvas>
          <div class="canvas-placeholder" id="canvas-placeholder">Teken hier uw handtekening</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-clear" id="btn-clear">Wissen</button>
          <button class="btn btn-submit" id="btn-submit" disabled>Ondertekenen en Bevestigen</button>
        </div>
        <p id="error-msg"></p>
        <p class="legal">
          Door te klikken op "Ondertekenen" bevestigt u namens <strong>${bedrijfNaam}</strong>
          akkoord te gaan met de voorwaarden van het stagecontract voor student <strong>${studentNaam}</strong>.
          Deze digitale handtekening is juridisch bindend.
        </p>
      </div>
    </div>

    <!-- Success screen -->
    <div id="result-screen">
      <h2>Contract ondertekend!</h2>
      <p>Bedankt. Het stagecontract voor <strong>${studentNaam}</strong> is succesvol ondertekend.<br>
      De school ontvangt automatisch een bevestiging. U kunt dit venster sluiten.</p>
    </div>
  </div>

<script>
  const canvas = document.getElementById('sig-canvas');
  const ctx = canvas.getContext('2d');
  const placeholder = document.getElementById('canvas-placeholder');
  const submitBtn = document.getElementById('btn-submit');
  const clearBtn = document.getElementById('btn-clear');
  const errorMsg = document.getElementById('error-msg');
  let drawing = false, hasDrawn = false;

  // Scale canvas for retina
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = 200 * ratio;
  canvas.style.height = '200px';
  ctx.scale(ratio, ratio);
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left),
      y: (src.clientY - rect.top)
    };
  }
  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }
  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasDrawn) {
      hasDrawn = true;
      placeholder.style.opacity = '0';
      submitBtn.disabled = false;
    }
  }
  function endDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw);

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    hasDrawn = false;
    placeholder.style.opacity = '1';
    submitBtn.disabled = true;
    errorMsg.style.display = 'none';
  });

  submitBtn.addEventListener('click', async () => {
    if (!hasDrawn) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met verwerken...';
    errorMsg.style.display = 'none';

    // Export canvas as PNG data URL
    const signatureData = canvas.toDataURL('image/png');

    try {
      const res = await fetch('/api/documents/sign/${token}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureData }),
      });
      if (res.ok) {
        document.getElementById('sign-screen').style.display = 'none';
        document.getElementById('result-screen').style.display = 'block';
      } else {
        const data = await res.json().catch(() => ({}));
        errorMsg.textContent = data.msg || 'Er is een fout opgetreden. Probeer opnieuw.';
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ondertekenen en Bevestigen';
      }
    } catch {
      errorMsg.textContent = 'Netwerkfout. Controleer uw verbinding en probeer opnieuw.';
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ondertekenen en Bevestigen';
    }
  });
</script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('Fout bij laden signing page:', err);
    return res.status(500).send('<h1>Serverfout</h1><p>' + (err.message || '') + '</p>');
  }
};

/**
 * POST /api/documents/sign/:token
 * Receives Base64 PNG signature, stamps it on the PDF, saves signed PDF, notifies admin.
 */
export const submitSignature = async (req, res, next) => {
  try {
    const doc = await StageDocument.findOne({
      where: { signing_token: req.params.token, type: 'contract_unsigned' },
      include: [
        {
          model: Stage, as: 'stage',
          include: [
            { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
            { model: Bedrijf, as: 'bedrijf' },
          ]
        }
      ]
    });

    if (!doc) return res.status(404).json({ msg: 'Ongeldige of verlopen link' });

    // Check already signed
    const alreadySigned = await StageDocument.findOne({
      where: { stage_id: doc.stage_id, type: 'contract_signed' }
    });
    if (alreadySigned) return res.status(410).json({ msg: 'Document al ondertekend' });

    const { signature } = req.body;
    if (!signature || !signature.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ msg: 'Ongeldige handtekening' });
    }

    // Load the original PDF
    const originalPath = path.join(uploadsDir, doc.stored_name);
    if (!fs.existsSync(originalPath)) {
      return res.status(404).json({ msg: 'Origineel document niet gevonden' });
    }

    const pdfBytes = fs.readFileSync(originalPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Decode signature PNG
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    const signatureBytes = Buffer.from(base64Data, 'base64');
    const sigImage = await pdfDoc.embedPng(signatureBytes);

    // Stamp signature on the last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    // Draw signature area at bottom of last page
    const sigWidth = 200;
    const sigHeight = 60;
    const sigX = 40;
    const sigY = 80;

    // Draw a subtle box and label
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    lastPage.drawText('Handtekening bedrijf:', {
      x: sigX, y: sigY + sigHeight + 8,
      size: 10, font, color: rgb(0.3, 0.3, 0.3),
    });
    lastPage.drawText(`Ondertekend op: ${new Date().toLocaleString('nl-BE')}`, {
      x: sigX, y: sigY - 14,
      size: 8, font, color: rgb(0.5, 0.5, 0.5),
    });
    lastPage.drawText(`Bedrijf: ${doc.stage?.bedrijf?.naam || ''}`, {
      x: sigX, y: sigY - 26,
      size: 8, font, color: rgb(0.5, 0.5, 0.5),
    });

    // Draw signature image
    lastPage.drawImage(sigImage, {
      x: sigX, y: sigY,
      width: sigWidth, height: sigHeight,
    });

    // Draw border around signature
    lastPage.drawRectangle({
      x: sigX - 4, y: sigY - 4,
      width: sigWidth + 8, height: sigHeight + 8,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
      opacity: 0,
    });

    // Save signed PDF
    const signedBytes = await pdfDoc.save();
    const signedFileName = `signed-${Date.now()}-${doc.stored_name}`;
    const signedPath = path.join(uploadsDir, signedFileName);
    fs.writeFileSync(signedPath, signedBytes);

    // Create signed document record
    const signedDoc = await StageDocument.create({
      stage_id: doc.stage_id,
      type: 'contract_signed',
      original_name: `ondertekend-${doc.original_name}`,
      stored_name: signedFileName,
      uploaded_by: doc.uploaded_by,
      signed_at: new Date(),
    });

    // Mark original token as used (set signed_at so it's tracked)
    await doc.update({ signed_at: new Date() });

    // Get admin email to notify
    const studentNaam = doc.stage?.student?.User
      ? `${doc.stage.student.User.first_name} ${doc.stage.student.User.last_name}`
      : 'Student';
    const bedrijfNaam = doc.stage?.bedrijf?.naam || 'Bedrijf';

    // Find any admin user to notify
    try {
      const adminUser = await Admin.findOne({ include: [{ model: User, as: 'User' }] });
      if (adminUser?.User?.email) {
        const downloadUrl = `http://localhost:3000/api/documents/${signedDoc.document_id}/download`;
        await sendSignedNotification(adminUser.User.email, studentNaam, bedrijfNaam, downloadUrl);
      }
    } catch (mailErr) {
      console.error('Kon admin niet notificeren (niet-blokkerend):', mailErr);
    }

    return res.status(200).json({ msg: 'Contract succesvol ondertekend' });
  } catch (err) {
    console.error('Fout bij verwerken handtekening:', err);
    return res.status(500).json({ msg: 'Fout bij verwerken handtekening: ' + (err.message || '') });
  }
};

/**
 * GET /api/documents/contract-status/:stageId
 * Returns the bedrijf contract status for the admin dashboard.
 */
export const getContractStatus = async (req, res, next) => {
  try {
    const stageId = parseInt(req.params.stageId);

    const unsigned = await StageDocument.findOne({
      where: { stage_id: stageId, type: 'contract_unsigned' },
      order: [['createdAt', 'DESC']],
    });
    const signed = await StageDocument.findOne({
      where: { stage_id: stageId, type: 'contract_signed' },
      order: [['createdAt', 'DESC']],
    });

    const stage = await Stage.findByPk(stageId, {
      include: [{ model: Bedrijf, as: 'bedrijf' }]
    });
    const bedrijf_email = stage?.bedrijf?.hr_email || null;

    if (signed) {
      return res.json({
        status: 'signed',
        signed_at: signed.signed_at,
        bedrijf_email: bedrijf_email,
        document_id: signed.document_id,
        original_name: signed.original_name,
      });
    }
    if (unsigned) {
      return res.json({
        status: 'pending',
        bedrijf_email: bedrijf_email,
        sent_at: unsigned.createdAt,
      });
    }
    return res.json({ status: 'none' });
  } catch (err) {
    console.error('Fout bij ophalen contract status:', err);
    return res.status(500).json({ msg: 'Fout bij ophalen contract status' });
  }
};
/**
 * POST /api/documents/student-sign/:id
 * Allows a student to electronically sign an admin template directly from the app.
 */
export const studentSignDocument = async (req, res, next) => {
  try {
    const cookieUser = req.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

    const docId = req.params.id;
    const { signature } = req.body;
    if (!signature || !signature.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ msg: 'Ongeldige handtekening' });
    }

    const adminDoc = await StageDocument.findOne({
      where: { document_id: docId, type: 'admin_template' }
    });
    if (!adminDoc) return res.status(404).json({ msg: 'Document niet gevonden' });

    // Ensure the student belongs to the stage
    const stage = await Stage.findByPk(adminDoc.stage_id, {
      include: [{ model: Student, as: 'student', include: [{ model: User, as: 'User' }] }]
    });
    if (!stage || stage.student?.User?.user_id !== cookieUser.user_id) {
      return res.status(403).json({ msg: 'Geen toegang tot deze stage' });
    }

    // Load original PDF
    const originalPath = path.join(uploadsDir, adminDoc.stored_name);
    if (!fs.existsSync(originalPath)) {
      return res.status(404).json({ msg: 'Origineel bestand niet gevonden op server' });
    }

    const pdfBytes = fs.readFileSync(originalPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Embed signature
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');
    const signatureBytes = Buffer.from(base64Data, 'base64');
    const sigImage = await pdfDoc.embedPng(signatureBytes);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const sigWidth = 200;
    const sigHeight = 60;
    const sigX = 40;
    const sigY = 80;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    lastPage.drawText('Handtekening student:', {
      x: sigX, y: sigY + sigHeight + 8,
      size: 10, font, color: rgb(0.3, 0.3, 0.3),
    });
    lastPage.drawImage(sigImage, {
      x: sigX, y: sigY,
      width: sigWidth, height: sigHeight,
    });
    const dateText = new Date().toLocaleDateString('nl-BE');
    lastPage.drawText(`Datum: ${dateText}`, {
      x: sigX, y: sigY - 15,
      size: 9, font, color: rgb(0.5, 0.5, 0.5),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const newFilename = `student-signed-${uuidv4()}.pdf`;
    const newPath = path.join(uploadsDir, newFilename);
    fs.writeFileSync(newPath, modifiedPdfBytes);

    const newDoc = await StageDocument.create({
      stage_id: adminDoc.stage_id,
      type: 'student_submission',
      original_name: 'ondertekend-' + adminDoc.original_name,
      stored_name: newFilename,
      uploaded_by: cookieUser.user_id,
    });

    stage.status = 'DOCUMENTGEUPLOADED';
    await stage.save();

    return res.status(201).json({ msg: 'Document succesvol ondertekend', document_id: newDoc.document_id });
  } catch (err) {
    console.error('Fout bij student in-app signing:', err);
    return res.status(500).json({ msg: 'Fout bij opslaan handtekening' });
  }
};

export default {
  adminUploadDocument,
  studentUploadDocument,
  getMyDocuments,
  getStageDocuments,
  downloadDocument,
  downloadDocumentByToken,
  sendContractToBedrijf,
  getSigningPage,
  submitSignature,
  getContractStatus,
  studentSignDocument
};
