import './adminDocumenten.css';
import './koppeldocent.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js';
import { renderCompetenties } from './competenties.js';


let teVersturen = [];
let wachtenOpStudent = [];
let ontvangen = [];
let afgecheckt = [];

// ── Bedrijf signing state ────────────────────────────────────────────────────
let contractTeVersturen = [];   // GOEDGEKEURD stages with no contract doc
let contractWachten = [];       // Contract sent, waiting for signature
let contractGetekend = [];      // Contract signed

let currentStageId = null;
let selectedFile = null;
let currentBedrijfEmail = '';

async function loadData() {
  const res = await fetch('/api/stages/goedgekeurd', { credentials: 'include' });
  if (!res.ok) throw new Error('Fout bij laden stages');
  const stages = await res.json();

  const details = await Promise.all(stages.map(async s => {
    const docsRes = await fetch(`/api/documents/stage/${s.id}`, { credentials: 'include' });
    const docs = await docsRes.json().catch(() => []);

    // Load bedrijf contract status
    const contractRes = await fetch(`/api/documents/contract-status/${s.id}`, { credentials: 'include' });
    const contractStatus = await contractRes.json().catch(() => ({ status: 'none' }));

    return {
      stage: s,
      docs: Array.isArray(docs) ? docs : [],
      validated: s.document_validated || false,
      contractStatus,
    };
  }));

  teVersturen = [];
  wachtenOpStudent = [];
  ontvangen = [];
  afgecheckt = [];
  contractTeVersturen = [];
  contractWachten = [];
  contractGetekend = [];

  for (const { stage, docs, validated, contractStatus } of details) {
    // ── Student document flow (unchanged) ───────────────────────────────────
    const adminDocs = docs.filter(d => d.type === 'admin_template');
    const studentDocs = docs.filter(d => d.type === 'student_submission');
    if (validated) {
      afgecheckt.push({ ...stage, studentDoc: studentDocs[0] || null });
    } else if (studentDocs.length > 0) {
      ontvangen.push({ ...stage, studentDoc: studentDocs[0] });
    } else if (adminDocs.length > 0) {
      wachtenOpStudent.push(stage);
    } else {
      teVersturen.push(stage);
    }

    // ── Bedrijf contract flow ────────────────────────────────────────────────
    if (contractStatus.status === 'signed') {
      contractGetekend.push({
        ...stage,
        signed_at: contractStatus.signed_at,
        bedrijf_email: contractStatus.bedrijf_email,
        document_id: contractStatus.document_id,
        original_name: contractStatus.original_name,
      });
    } else if (contractStatus.status === 'pending') {
      contractWachten.push({
        ...stage,
        bedrijf_email: contractStatus.bedrijf_email,
        sent_at: contractStatus.sent_at,
      });
    } else {
      contractTeVersturen.push(stage);
    }
  }
}

function formatPeriode(begin, eind) {
  if (!begin || !eind) return '-';
  const fmt = d => new Date(d).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt(begin)} – ${fmt(eind)}`;
}

// ─── Student doc sections (unchanged) ────────────────────────────────────────

function renderTeVersturen(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--oranje">
      Contract te versturen naar student (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead class="kp-thead--oranje">
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Geen studenten zonder contract.</td></tr>`
          : lijst.map(s => `
            <tr class="kp-rij--oranje">
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--oranje">Contract te versturen</span></td>
              <td>
                <button class="kp-btn kp-btn--toewijzen" data-id="${s.id}" data-actie="versturen">
                  Contract versturen
                </button>
              </td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderWachtenOpStudent(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--wachten" style="margin-top:32px;">
      Wachten op student (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead class="kp-thead--wachten">
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="4" style="padding:16px;color:#6b7280;">Geen studenten in afwachting.</td></tr>`
          : lijst.map(s => `
            <tr class="kp-rij--wachten">
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--wachten">Contract verstuurd — wachten op student</span></td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderOntvangen(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top:32px;">
      Contract ontvangen van student (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead>
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Geen ingediende contracten.</td></tr>`
          : lijst.map(s => `
            <tr>
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--blauw">Ingediend door student</span></td>
              <td class="ad-acties-cel">
                ${s.studentDoc ? `<a href="/api/documents/${s.studentDoc.id}/download" class="kp-btn kp-btn--downloaden" download>Downloaden</a>` : ''}
                <button class="kp-btn kp-btn--toewijzen" data-id="${s.id}" data-actie="afchecken">Afchecken</button>
              </td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderAfgecheckt(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top:32px;">
      Afgecheckte studenten (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead>
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="4" style="padding:16px;color:#6b7280;">Geen afgecheckte studenten.</td></tr>`
          : lijst.map(s => `
            <tr>
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--groen">Gevalideerd ✓</span></td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

// ─── Bedrijf contract sections ────────────────────────────────────────────────

function renderContractTeVersturen(lijst) {
  return `
    <div class="ad-divider"></div>
    <h2 class="kp-sectie-hoofdtitel">Bedrijfscontract - Ondertekening</h2>
    <h3 class="kp-sectie-titel kp-sectie-titel--paars">
      Contract te versturen naar bedrijf (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead class="kp-thead--paars">
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Geen stages zonder bedrijfscontract.</td></tr>`
          : lijst.map(s => `
            <tr class="kp-rij--paars">
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--paars">Contract te versturen</span></td>
              <td>
                <button class="kp-btn kp-btn--paars" data-id="${s.id}" data-email="${s.bedrijfHrEmail || ''}" data-actie="contract-versturen">
                  Versturen naar bedrijf
                </button>
              </td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderContractWachten(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--wachten" style="margin-top:32px;">
      Wachten op handtekening bedrijf (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead class="kp-thead--wachten">
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Verstuurd naar</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Geen contracten in afwachting.</td></tr>`
          : lijst.map(s => `
            <tr class="kp-rij--wachten">
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td style="font-size:13px;color:#6b7280;">${s.bedrijf_email || '-'}</td>
              <td><span class="kp-badge kp-badge--wachten">Wachten op handtekening</span></td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderContractGetekend(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top:32px;">
      Ondertekend door bedrijf (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead>
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Ondertekend op</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Nog geen ondertekende contracten.</td></tr>`
          : lijst.map(s => `
            <tr>
              <td>${s.naam || '-'}</td>
              <td>${s.bedrijf || '-'}</td>
              <td>${formatPeriode(s.stageDetails?.start, s.stageDetails?.einde)}</td>
              <td><span class="kp-badge kp-badge--groen">Getekend ${s.signed_at ? new Date(s.signed_at).toLocaleDateString('nl-BE') : '-'}</span></td>
              <td>
                <a href="/api/documents/${s.document_id}/download" class="kp-btn kp-btn--downloaden" download>
                  Download
                </a>
              </td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function herrender() {
  document.getElementById('sectie-te-versturen').innerHTML = renderTeVersturen(teVersturen);
  document.getElementById('sectie-wachten').innerHTML = renderWachtenOpStudent(wachtenOpStudent);
  document.getElementById('sectie-ontvangen').innerHTML = renderOntvangen(ontvangen);
  document.getElementById('sectie-afgecheckt').innerHTML = renderAfgecheckt(afgecheckt);
  document.getElementById('sectie-contract-te-versturen').innerHTML = renderContractTeVersturen(contractTeVersturen);
  document.getElementById('sectie-contract-wachten').innerHTML = renderContractWachten(contractWachten);
  document.getElementById('sectie-contract-getekend').innerHTML = renderContractGetekend(contractGetekend);
  setupKnoppen();
}

function setupKnoppen() {
  document.querySelectorAll('.kp-btn[data-actie="versturen"]').forEach(btn => {
    btn.addEventListener('click', () => openUploadModal(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.kp-btn[data-actie="afchecken"]').forEach(btn => {
    btn.addEventListener('click', () => openValidateModal(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.kp-btn[data-actie="contract-versturen"]').forEach(btn => {
    btn.addEventListener('click', () => openContractModal(parseInt(btn.dataset.id), btn.dataset.email || ''));
  });
}

function openValidateModal(stageId) {
  currentStageId = stageId;
  document.getElementById('ad-validate-modal').classList.add('active');
}

function openUploadModal(stageId) {
  currentStageId = stageId;
  selectedFile = null;
  document.getElementById('ad-file-input').value = '';
  document.getElementById('ad-upload-zone').style.display = '';
  document.getElementById('ad-selected').style.display = 'none';
  document.getElementById('ad-selected-name').textContent = '';
  document.getElementById('ad-upload-btn').disabled = true;
  document.getElementById('ad-upload-btn').textContent = 'Versturen';
  document.getElementById('ad-upload-modal').classList.add('active');
}

function openContractModal(stageId, bedrijfEmail) {
  currentStageId = stageId;
  currentBedrijfEmail = bedrijfEmail;
  selectedFile = null;
  document.getElementById('ad-contract-file-input').value = '';
  document.getElementById('ad-contract-upload-zone').style.display = '';
  document.getElementById('ad-contract-selected').style.display = 'none';
  document.getElementById('ad-contract-selected-name').textContent = '';
  document.getElementById('ad-contract-email').value = bedrijfEmail;
  document.getElementById('ad-contract-send-btn').disabled = true;
  document.getElementById('ad-contract-send-btn').textContent = 'Versturen';
  document.getElementById('ad-contract-modal').classList.add('active');
}

export async function renderAdminDocumenten(app) {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="nav-item" id="navGebruikers">Gebruikers</a>
          <a href="#" class="nav-item" id="navKoppelingen">Koppelingen</a>
          <a href="#" class="nav-item active" id="navDocumenten">Documenten</a>
          <a href="#" class="nav-item" id="navCompetenties">Competenties</a>
        </nav>
        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <button class="logout-link" id="ad-logout">Uitloggen</button>
        </div>
      </aside>

      <main class="main-content">
        <h1 class="page-title">Documentenbeheer</h1>

        <!-- Student doc sections -->
        <section class="kp-sectie" id="sectie-te-versturen">
          <p style="color:#6b7280;">Laden...</p>
        </section>
        <section class="kp-sectie" id="sectie-wachten"></section>
        <section class="kp-sectie" id="sectie-ontvangen"></section>
        <section class="kp-sectie" id="sectie-afgecheckt"></section>

        <!-- Bedrijf contract sections -->
        <section class="kp-sectie" id="sectie-contract-te-versturen"></section>
        <section class="kp-sectie" id="sectie-contract-wachten"></section>
        <section class="kp-sectie" id="sectie-contract-getekend"></section>
      </main>
    </div>

    <!-- Upload Modal (student flow) -->
    <div class="kp-modal-overlay" id="ad-upload-modal">
      <div class="kp-modal ad-upload-modal-body">
        <h2 class="kp-modal-titel">Contract versturen naar student</h2>
        <div class="ad-upload-zone" id="ad-upload-zone">
          <div class="ad-upload-icon">&#128194;</div>
          <p class="ad-upload-text">Sleep je bestand hierheen of klik om te selecteren</p>
          <p class="ad-upload-subtext">PDF, DOCX — max. 10MB</p>
          <input type="file" id="ad-file-input" class="ad-file-input" accept=".pdf,.doc,.docx">
        </div>
        <div class="ad-selected" id="ad-selected" style="display:none;">
          <span class="ad-selected-name" id="ad-selected-name"></span>
          <button type="button" class="ad-remove-btn" id="ad-remove-btn">&#10005;</button>
        </div>
        <div class="kp-modal-acties" style="margin-top:20px;">
          <button class="kp-btn kp-btn--wijzigen" id="ad-upload-annuleren">Annuleren</button>
          <button class="kp-btn kp-btn--toewijzen" id="ad-upload-btn" disabled>Versturen</button>
        </div>
      </div>
    </div>

    <!-- Validate Modal -->
    <div class="kp-modal-overlay" id="ad-validate-modal">
      <div class="kp-modal" style="text-align:center;">
        <div style="font-size:36px;margin-bottom:12px;">&#9989;</div>
        <h2 class="kp-modal-titel">Document valideren?</h2>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.5;">
          Weet je zeker dat je het ingediende document wilt valideren?
          Deze actie kan niet ongedaan worden gemaakt.
        </p>
        <div class="kp-modal-acties" style="justify-content:center;">
          <button class="kp-btn kp-btn--wijzigen" id="ad-validate-annuleren">Annuleren</button>
          <button class="kp-btn kp-btn--toewijzen ad-btn--valideer" id="ad-validate-confirm">Valideer</button>
        </div>
      </div>
    </div>

    <!-- Contract naar bedrijf Modal -->
    <div class="kp-modal-overlay" id="ad-contract-modal">
      <div class="kp-modal ad-upload-modal-body">
        <h2 class="kp-modal-titel">Contract versturen naar bedrijf</h2>
        <p style="font-size:14px;color:#6b7280;margin:0 0 20px;line-height:1.5;">
          Upload het te ondertekenen contract en verstuur het naar de HR-contactpersoon van het bedrijf.
          Zij ontvangen een e-mail met een persoonlijke ondertekeningslink.
        </p>

        <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">
          HR E-mail bedrijf *
        </label>
        <input type="email" id="ad-contract-email" class="ad-email-input"
               placeholder="hr@bedrijf.be" style="width:100%;margin-bottom:20px;">

        <label style="font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px;">
          Contract PDF *
        </label>
        <div class="ad-upload-zone" id="ad-contract-upload-zone">
          <div class="ad-upload-icon">&#128194;</div>
          <p class="ad-upload-text">Sleep het PDF-contract hierheen of klik om te selecteren</p>
          <p class="ad-upload-subtext">PDF - max. 10MB</p>
          <input type="file" id="ad-contract-file-input" class="ad-file-input" accept=".pdf">
        </div>
        <div class="ad-selected" id="ad-contract-selected" style="display:none;">
          <span class="ad-selected-name" id="ad-contract-selected-name"></span>
          <button type="button" class="ad-remove-btn" id="ad-contract-remove-btn">&#10005;</button>
        </div>
        <div class="kp-modal-acties" style="margin-top:20px;">
          <button class="kp-btn kp-btn--wijzigen" id="ad-contract-annuleren">Annuleren</button>
          <button class="kp-btn kp-btn--paars" id="ad-contract-send-btn" disabled>Versturen</button>
        </div>
      </div>
    </div>

    <!-- Upload Toast -->
    <div class="ad-toast ad-toast--upload" id="ad-toast-upload" style="display:none;">
      <span class="ad-toast-icon">&#128228;</span>
      <span class="ad-toast-text">Contract succesvol verstuurd naar student!</span>
    </div>

    <!-- Valideer Toast -->
    <div class="ad-toast" id="ad-toast" style="display:none;">
      <span class="ad-toast-icon">&#10003;</span>
      <span class="ad-toast-text">Document succesvol gevalideerd!</span>
    </div>

    <!-- Contract Verstuurd Toast -->
    <div class="ad-toast ad-toast--paars" id="ad-toast-contract" style="display:none;">
      <span class="ad-toast-icon">&#10003;</span>
      <span class="ad-toast-text">Contract succesvol verstuurd naar het bedrijf!</span>
    </div>

  `;

  // NAVIGATIE
  document.getElementById('navGebruikers').addEventListener('click', (e) => {
    e.preventDefault();
    renderAdmin(app);
  });

  document.getElementById('navKoppelingen').addEventListener('click', (e) => {
    e.preventDefault();
    renderKoppelingen(app);
  });

  document.getElementById('navDocumenten')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAdminDocumenten(app);
  });

  document.getElementById('navCompetenties').addEventListener('click', (e) => {
    e.preventDefault();
    renderCompetenties(app);
  });

  // LOGOUT
  document.getElementById('ad-logout').addEventListener('click', async () => {
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    window.location.href = '/login';
  });

  // ── STUDENT UPLOAD MODAL ───────────────────────────────────────────────────
  const uploadModal = document.getElementById('ad-upload-modal');
  const uploadZone = document.getElementById('ad-upload-zone');
  const fileInput = document.getElementById('ad-file-input');
  const selectedEl = document.getElementById('ad-selected');
  const selectedName = document.getElementById('ad-selected-name');
  const uploadBtn = document.getElementById('ad-upload-btn');

  function showFile(file) {
    selectedFile = file;
    selectedName.textContent = file.name;
    uploadZone.style.display = 'none';
    selectedEl.style.display = 'flex';
    uploadBtn.disabled = false;
  }

  function resetFile() {
    selectedFile = null;
    fileInput.value = '';
    uploadZone.style.display = '';
    selectedEl.style.display = 'none';
    selectedName.textContent = '';
    uploadBtn.disabled = true;
  }

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) showFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) showFile(fileInput.files[0]); });
  document.getElementById('ad-remove-btn').addEventListener('click', resetFile);

  uploadModal.addEventListener('click', e => { if (e.target === uploadModal) { uploadModal.classList.remove('active'); resetFile(); } });
  document.getElementById('ad-upload-annuleren').addEventListener('click', () => {
    uploadModal.classList.remove('active');
    resetFile();
  });

  uploadBtn.addEventListener('click', async () => {
    if (!currentStageId || !selectedFile) return;
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Bezig...';

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('stage_id', currentStageId);

    try {
      const res = await fetch('/api/documents/admin-upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Fout bij uploaden: ' + (err.msg || res.status));
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Versturen';
        return;
      }
      uploadModal.classList.remove('active');
      resetFile();
      await loadData();
      herrender();
      const uploadToast = document.getElementById('ad-toast-upload');
      uploadToast.style.display = 'flex';
      setTimeout(() => { uploadToast.style.display = 'none'; }, 3500);
    } catch {
      alert('Geen verbinding met de server.');
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Versturen';
    }
  });

  // ── VALIDATE MODAL ─────────────────────────────────────────────────────────
  const validateModal = document.getElementById('ad-validate-modal');
  const toast = document.getElementById('ad-toast');

  validateModal.addEventListener('click', e => { if (e.target === validateModal) validateModal.classList.remove('active'); });
  document.getElementById('ad-validate-annuleren').addEventListener('click', () => {
    validateModal.classList.remove('active');
  });

  document.getElementById('ad-validate-confirm').addEventListener('click', async () => {
    const confirmBtn = document.getElementById('ad-validate-confirm');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Bezig...';
    validateModal.classList.remove('active');
    try {
      const res = await fetch(`/api/stages/${currentStageId}/validate-document`, {
        method: 'PUT',
        credentials: 'include',
      });
      if (res.ok) {
        const idx = ontvangen.findIndex(s => s.id === currentStageId);
        if (idx !== -1) {
          const [stage] = ontvangen.splice(idx, 1);
          afgecheckt.push(stage);
        }
        herrender();
        toast.style.display = 'flex';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
      } else {
        alert('Fout bij valideren');
      }
    } catch {
      alert('Geen verbinding met de server');
    }
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Valideer';
  });

  // ── CONTRACT NAAR BEDRIJF MODAL ────────────────────────────────────────────
  const contractModal = document.getElementById('ad-contract-modal');
  const contractUploadZone = document.getElementById('ad-contract-upload-zone');
  const contractFileInput = document.getElementById('ad-contract-file-input');
  const contractSelectedEl = document.getElementById('ad-contract-selected');
  const contractSelectedName = document.getElementById('ad-contract-selected-name');
  const contractSendBtn = document.getElementById('ad-contract-send-btn');
  const contractEmailInput = document.getElementById('ad-contract-email');
  let contractSelectedFile = null;

  function showContractFile(file) {
    contractSelectedFile = file;
    contractSelectedName.textContent = file.name;
    contractUploadZone.style.display = 'none';
    contractSelectedEl.style.display = 'flex';
    updateContractSendBtn();
  }

  function resetContractFile() {
    contractSelectedFile = null;
    contractFileInput.value = '';
    contractUploadZone.style.display = '';
    contractSelectedEl.style.display = 'none';
    contractSelectedName.textContent = '';
    updateContractSendBtn();
  }

  function updateContractSendBtn() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contractEmailInput.value.trim());
    contractSendBtn.disabled = !contractSelectedFile || !emailValid;
  }

  contractEmailInput.addEventListener('input', updateContractSendBtn);
  contractUploadZone.addEventListener('click', () => contractFileInput.click());
  contractUploadZone.addEventListener('dragover', e => { e.preventDefault(); contractUploadZone.classList.add('dragover'); });
  contractUploadZone.addEventListener('dragleave', () => contractUploadZone.classList.remove('dragover'));
  contractUploadZone.addEventListener('drop', e => {
    e.preventDefault();
    contractUploadZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) showContractFile(e.dataTransfer.files[0]);
  });
  contractFileInput.addEventListener('change', () => { if (contractFileInput.files[0]) showContractFile(contractFileInput.files[0]); });
  document.getElementById('ad-contract-remove-btn').addEventListener('click', resetContractFile);

  contractModal.addEventListener('click', e => {
    if (e.target === contractModal) { contractModal.classList.remove('active'); resetContractFile(); }
  });
  document.getElementById('ad-contract-annuleren').addEventListener('click', () => {
    contractModal.classList.remove('active');
    resetContractFile();
  });

  contractSendBtn.addEventListener('click', async () => {
    if (!currentStageId || !contractSelectedFile) return;
    const email = contractEmailInput.value.trim();
    if (!email) { alert('Vul een e-mailadres in.'); return; }

    contractSendBtn.disabled = true;
    contractSendBtn.textContent = 'Bezig met versturen...';

    const formData = new FormData();
    formData.append('document', contractSelectedFile);
    formData.append('stage_id', currentStageId);
    formData.append('bedrijf_email', email);

    try {
      const res = await fetch('/api/documents/send-contract', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Fout bij versturen: ' + (err.msg || res.status));
        contractSendBtn.disabled = false;
        contractSendBtn.textContent = 'Versturen';
        return;
      }
      contractModal.classList.remove('active');
      resetContractFile();
      await loadData();
      herrender();
      const contractToast = document.getElementById('ad-toast-contract');
      contractToast.style.display = 'flex';
      setTimeout(() => { contractToast.style.display = 'none'; }, 3500);
    } catch {
      alert('Geen verbinding met de server.');
      contractSendBtn.disabled = false;
      contractSendBtn.textContent = '📤 Versturen';
    }
  });

  // INIT
  try {
    await loadData();
    herrender();
  } catch (err) {
    document.getElementById('sectie-te-versturen').innerHTML =
      `<p style="color:red;">Kan data niet laden: ${err.message}</p>`;
  }
}
