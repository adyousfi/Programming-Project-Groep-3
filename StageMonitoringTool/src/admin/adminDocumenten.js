import './adminDocumenten.css';
import './koppeldocent.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js';

let teVersturen = [];
let wachtenOpStudent = [];
let ontvangen = [];
let afgecheckt = [];
let currentStageId = null;
let selectedFile = null;

async function loadData() {
  const res = await fetch('/api/stages/goedgekeurd', { credentials: 'include' });
  if (!res.ok) throw new Error('Fout bij laden stages');
  const stages = await res.json();

  const details = await Promise.all(stages.map(async s => {
    const docsRes = await fetch(`/api/documents/stage/${s.id}`, { credentials: 'include' });
    const docs = await docsRes.json().catch(() => []);
    return { stage: s, docs: Array.isArray(docs) ? docs : [], validated: s.document_validated || false };
  }));

  teVersturen = [];
  wachtenOpStudent = [];
  ontvangen = [];
  afgecheckt = [];

  for (const { stage, docs, validated } of details) {
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
  }
}

function formatPeriode(begin, eind) {
  if (!begin || !eind) return '-';
  const fmt = d => new Date(d).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${fmt(begin)} – ${fmt(eind)}`;
}

function renderTeVersturen(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--oranje">
      Contract te versturen (${lijst.length})
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

function herrender() {
  document.getElementById('sectie-te-versturen').innerHTML = renderTeVersturen(teVersturen);
  document.getElementById('sectie-wachten').innerHTML = renderWachtenOpStudent(wachtenOpStudent);
  document.getElementById('sectie-ontvangen').innerHTML = renderOntvangen(ontvangen);
  document.getElementById('sectie-afgecheckt').innerHTML = renderAfgecheckt(afgecheckt);
  setupKnoppen();
}

function setupKnoppen() {
  document.querySelectorAll('.kp-btn[data-actie="versturen"]').forEach(btn => {
    btn.addEventListener('click', () => openUploadModal(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.kp-btn[data-actie="afchecken"]').forEach(btn => {
    btn.addEventListener('click', () => openValidateModal(parseInt(btn.dataset.id)));
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

        <section class="kp-sectie" id="sectie-te-versturen">
          <p style="color:#6b7280;">Laden...</p>
        </section>
        <section class="kp-sectie" id="sectie-wachten"></section>
        <section class="kp-sectie" id="sectie-ontvangen"></section>
        <section class="kp-sectie" id="sectie-afgecheckt"></section>
      </main>
    </div>

    <!-- Upload Modal -->
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

  `;

  // NAVIGATIE
  document.getElementById('navGebruikers').addEventListener('click', e => { e.preventDefault(); renderAdmin(app); });
  document.getElementById('navKoppelingen').addEventListener('click', e => { e.preventDefault(); renderKoppelingen(app); });
  document.getElementById('navDocumenten').addEventListener('click', e => { e.preventDefault(); renderAdminDocumenten(app); });
  document.getElementById('navCompetenties').addEventListener('click', e => { e.preventDefault(); renderAdmin(app); });

  // LOGOUT
  document.getElementById('ad-logout').addEventListener('click', async () => {
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

  // UPLOAD MODAL
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

  // VALIDATE MODAL
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

  // INIT
  try {
    await loadData();
    herrender();
  } catch (err) {
    document.getElementById('sectie-te-versturen').innerHTML =
      `<p style="color:red;">Kan data niet laden: ${err.message}</p>`;
  }
}
