import './adminDocumenten.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js'; // check pad!

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
        <h1 class="page-title" style="margin-bottom: 24px;">Documentenbeheer</h1>

        <div class="ad-upload-card">
          <h2 class="ad-card-title">Document versturen naar student</h2>
          <p class="ad-card-sub">
            Selecteer een goedgekeurde stage en upload het document dat de student moet invullen.
          </p>

          <div class="ad-form">
            <div class="ad-form-group">
              <label class="ad-label">Student / Stage</label>
              <select class="ad-select" id="ad-stage-select">
                <option value="">Laden...</option>
              </select>
            </div>

            <div class="ad-form-group">
              <label class="ad-label">Document uploaden</label>
              <div class="ad-upload-zone" id="ad-upload-zone">
                <div class="ad-upload-icon">&#128194;</div>
                <p class="ad-upload-text">
                  Sleep je bestand hierheen of klik om te selecteren
                </p>
                <p class="ad-upload-subtext">PDF, DOCX — max. 10MB</p>
                <input type="file" id="ad-file-input" class="ad-file-input" accept=".pdf,.doc,.docx">
              </div>

              <div class="ad-selected" id="ad-selected" style="display:none;">
                <span class="ad-selected-name" id="ad-selected-name"></span>
                <button type="button" class="ad-remove-btn" id="ad-remove-btn">&#10005;</button>
              </div>
            </div>

            <button type="button" class="ad-submit-btn" id="ad-submit-btn" disabled>
              Versturen naar student
            </button>
          </div>
        </div>

        <div class="ad-history-card" id="ad-history-card" style="display:none;">
          <h2 class="ad-card-title">Verzonden documenten</h2>
          <div id="ad-history-list"></div>
        </div>
      </main>
    </div>

    <!-- Validatie Modal -->
    <div class="ad-modal-overlay" id="ad-modal-overlay" style="display:none;">
      <div class="ad-modal">
        <div class="ad-modal-icon">&#9989;</div>
        <h3 class="ad-modal-title">Document valideren?</h3>
        <p class="ad-modal-text">Weet je zeker dat je het ingediende document van de student wilt valideren? Deze actie kan niet ongedaan worden gemaakt.</p>
        <div class="ad-modal-actions">
          <button class="ad-modal-btn ad-modal-btn-cancel" id="ad-modal-cancel">Annuleren</button>
          <button class="ad-modal-btn ad-modal-btn-confirm" id="ad-modal-confirm">Valideer</button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div class="ad-toast" id="ad-toast" style="display:none;">
      <span class="ad-toast-icon">&#10003;</span>
      <span class="ad-toast-text">Document succesvol gevalideerd!</span>
    </div>
  `;

  // ================= NAVIGATIE =================
  document.getElementById('navGebruikers').addEventListener('click', (e) => {
    e.preventDefault();
    renderAdmin(app);
  });

  document.getElementById('navKoppelingen').addEventListener('click', (e) => {
    e.preventDefault();
    renderKoppelingen(app);
  });

  document.getElementById('navDocumenten').addEventListener('click', (e) => {
    e.preventDefault();
    renderAdminDocumenten(app);
  });

  document.getElementById('navCompetenties').addEventListener('click', (e) => {
    e.preventDefault();
    renderAdmin(app); // fallback
  });

  // ================= LOGOUT =================
  document.getElementById('ad-logout').addEventListener('click', async () => {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

  const stageSelect = document.getElementById('ad-stage-select');
  const uploadZone = document.getElementById('ad-upload-zone');
  const fileInput = document.getElementById('ad-file-input');
  const selected = document.getElementById('ad-selected');
  const selectedName = document.getElementById('ad-selected-name');
  const removeBtn = document.getElementById('ad-remove-btn');
  const submitBtn = document.getElementById('ad-submit-btn');

  let selectedFile = null;

  async function loadStages() {
    try {
      const res = await fetch('/api/stages/goedgekeurd', { credentials: 'include' });
      const stages = await res.json();

      if (!Array.isArray(stages) || stages.length === 0) {
        stageSelect.innerHTML = '<option value="">Geen goedgekeurde stages gevonden</option>';
        return;
      }

      stageSelect.innerHTML =
        '<option value="">Kies een student...</option>' +
        stages
          .map(s => `<option value="${s.id}">${s.naam} — ${s.bedrijf}</option>`)
          .join('');
    } catch {
      stageSelect.innerHTML = '<option value="">Fout bij laden</option>';
    }
  }

  function updateSubmitBtn() {
    submitBtn.disabled = !(stageSelect.value && selectedFile);
  }

  function showFile(file) {
    selectedFile = file;
    selectedName.textContent = file.name;
    uploadZone.style.display = 'none';
    selected.style.display = 'flex';
    updateSubmitBtn();
  }

  function resetFile() {
    selectedFile = null;
    fileInput.value = '';
    uploadZone.style.display = '';
    selected.style.display = 'none';
    updateSubmitBtn();
  }

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) showFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) showFile(fileInput.files[0]);
  });

  removeBtn.addEventListener('click', resetFile);

  stageSelect.addEventListener('change', () => {
    updateSubmitBtn();
    loadDocumentHistory(stageSelect.value);
  });

  submitBtn.addEventListener('click', async () => {
    if (!stageSelect.value || !selectedFile) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met uploaden...';

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('stage_id', stageSelect.value);

    try {
      const res = await fetch('/api/documents/admin-upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert('Fout bij uploaden: ' + (err.msg || res.status));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Versturen naar student';
        return;
      }
    } catch {
      alert('Geen verbinding met de server.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Versturen naar student';
      return;
    }

    alert('Document succesvol verstuurd naar de student!');
    resetFile();
    submitBtn.textContent = 'Versturen naar student';
    loadDocumentHistory(stageSelect.value);
  });

  async function loadDocumentHistory(stageId) {
    const historyCard = document.getElementById('ad-history-card');
    const historyList = document.getElementById('ad-history-list');

    if (!stageId) {
      historyCard.style.display = 'none';
      return;
    }

    let docs = [];
    let isValidated = false;
    try {
      const [docsRes, stageRes] = await Promise.all([
        fetch(`/api/documents/stage/${stageId}`, { credentials: 'include' }),
        fetch(`/api/stages/${stageId}`, { credentials: 'include' })
      ]);
      docs = await docsRes.json();
      const stageData = await stageRes.json();
      isValidated = stageData.document_validated || false;
    } catch {}

    const adminDocs = docs.filter(d => d.type === 'admin_template');
    const studentDocs = docs.filter(d => d.type === 'student_submission');

    if (docs.length === 0) {
      historyCard.style.display = 'none';
      return;
    }

    historyCard.style.display = '';

    historyList.innerHTML = `
      ${adminDocs.length > 0 ? `
        <p class="ad-history-label">Verstuurd door admin</p>
        ${adminDocs.map(d => `
          <div class="ad-history-item">
            <span class="ad-doc-icon">&#128196;</span>
            <span class="ad-doc-name">${d.name}</span>
            <span class="ad-doc-date">${d.datum}</span>
            <a href="/api/documents/${d.id}/download" class="ad-download-btn" download>Downloaden</a>
          </div>
        `).join('')}
      ` : ''}

      ${studentDocs.length > 0 ? `
        <p class="ad-history-label" style="margin-top:16px;">Ingediend door student</p>
        ${studentDocs.map(d => `
          <div class="ad-history-item">
            <span class="ad-doc-icon">&#128196;</span>
            <span class="ad-doc-name">${d.name}</span>
            <span class="ad-doc-date">${d.datum}</span>
            <a href="/api/documents/${d.id}/download" class="ad-download-btn" download>Downloaden</a>
          </div>
        `).join('')}
        <div style="margin-top:16px;">
          ${isValidated
            ? `<span style="display:inline-block;padding:8px 16px;background:#198754;color:#fff;border-radius:6px;font-weight:600;font-size:0.9rem;">&#10003; Document Gevalideerd</span>`
            : `<button id="ad-validate-btn" style="background:#198754;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.9rem;">Valideer Document</button>`
          }
        </div>
      ` : ''}
    `;

    if (!isValidated && studentDocs.length > 0) {
      const overlay = document.getElementById('ad-modal-overlay');
      const cancelBtn = document.getElementById('ad-modal-cancel');
      const confirmBtn = document.getElementById('ad-modal-confirm');
      const toast = document.getElementById('ad-toast');

      document.getElementById('ad-validate-btn').addEventListener('click', () => {
        overlay.style.display = 'flex';
      });

      cancelBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });

      confirmBtn.addEventListener('click', async () => {
        overlay.style.display = 'none';
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Bezig...';
        try {
          const res = await fetch(`/api/stages/${stageId}/validate-document`, {
            method: 'PUT',
            credentials: 'include',
          });
          if (res.ok) {
            loadDocumentHistory(stageId);
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
    }
  }

  await loadStages();
}