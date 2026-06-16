import './koppeldocent.css';
import { renderAdmin } from './admin.js';
import { renderAdminDocumenten } from './adminDocumenten.js'; // check pad!
import { renderCompetenties } from './competenties.js';


const API_URL = 'http://localhost:3000';

let zonderDocent = [];
let gekoppeld = [];
let beschikbareDocenten = [];

// ================= DATA =================
async function loadData() {
  const stagesRes = await fetch(`${API_URL}/select-stage`);
  if (!stagesRes.ok) throw new Error('Fout bij laden stages');
  // 1. Get the full response object
  const stagesResult = await stagesRes.json();
  // 2. Extract the actual array from the .data property
  const stages = stagesResult.data || [];

  const docentenRes = await fetch(`${API_URL}/select-docent`);
  if (!docentenRes.ok) throw new Error('Fout bij laden docenten');
  // 3. Extract the docenten array
  const docentenResult = await docentenRes.json();
  const rawDocenten = docentenResult.data || [];

  // Map docenten so they have user_id, first_name, last_name
  beschikbareDocenten = rawDocenten.map(d => ({
    user_id: d.user_id,
    first_name: d.User?.first_name || '',
    last_name: d.User?.last_name || '',
  }));

  zonderDocent = stages
    .filter(s => !s.docent || !s.docent.User || !s.docent.User.first_name)
    .map(s => {
      const studentUser = s.student?.User;
      const studentNaam = studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '-';
      const bedrijfNaam = s.bedrijf?.naam || '-';
      return {
        id: s.stage_id,
        naam: studentNaam,
        bedrijf: bedrijfNaam,
        periode: formatPeriode(s.begin_datum, s.eind_datum),
        docent_id: null,
      };
    });

  gekoppeld = stages
    .filter(s => s.docent && s.docent.User && s.docent.User.first_name)
    .map(s => {
      const studentUser = s.student?.User;
      const studentNaam = studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '-';
      const bedrijfNaam = s.bedrijf?.naam || '-';
      const docentUser = s.docent?.User;
      const docentNaam = docentUser ? `${docentUser.first_name} ${docentUser.last_name}` : '-';
      return {
        id: s.stage_id,
        naam: studentNaam,
        bedrijf: bedrijfNaam,
        periode: formatPeriode(s.begin_datum, s.eind_datum),
        docent: docentNaam,
        docent_id: s.docent?.user_id || null,
        status: s.status,
      };
    });
}

function formatPeriode(begin, eind) {
  if (!begin || !eind) return '-';
  const fmt = d =>
    new Date(d).toLocaleDateString('nl-BE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  return `${fmt(begin)} - ${fmt(eind)}`;
}

// ================= API =================
async function slaDocentOp(stageId, docentId) {
  const res = await fetch(`${API_URL}/update-stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage_id: stageId, docent_id: docentId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.msg || 'Onbekende fout');
  }
}

// ================= RENDER =================
function renderZonderDocent(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--oranje">
      Studenten zonder docent (${lijst.length})
    </h3>

    <table class="kp-tabel">
      <thead class="kp-thead--oranje">
        <tr>
          <th>Studentnaam</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Status</th>
          <th>Acties</th>
        </tr>
      </thead>

      <tbody>
        ${
          lijst.length === 0
            ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">
                 Geen studenten zonder docent.
               </td></tr>`
            : lijst
                .map(
                  s => `
          <tr class="kp-rij--oranje">
            <td>${s.naam}</td>
            <td>${s.bedrijf}</td>
            <td>${s.periode}</td>
            <td>
              <span class="kp-badge kp-badge--oranje">
                Geen docent toegewezen
              </span>
            </td>
            <td>
              <button class="kp-btn kp-btn--toewijzen"
                data-id="${s.id}" data-actie="toewijzen">
                Docent toewijzen
              </button>
            </td>
          </tr>
        `
                )
                .join('')
        }
      </tbody>
    </table>
  `;
}

function renderGekoppeld(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top: 32px;">
      Gekoppelde studenten (${lijst.length})
    </h3>

    <table class="kp-tabel">
      <thead>
        <tr>
          <th>Studentnaam</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Toegewezen docent</th>
          <th>Status</th>
          <th>Acties</th>
        </tr>
      </thead>

      <tbody>
        ${
          lijst.length === 0
            ? `<tr><td colspan="6" style="padding:16px;color:#6b7280;">
                 Geen gekoppelde studenten.
               </td></tr>`
            : lijst
                .map(
                  s => `
          <tr>
            <td>${s.naam}</td>
            <td>${s.bedrijf}</td>
            <td>${s.periode}</td>
            <td>${s.docent}</td>
            <td>
              <span class="kp-badge kp-badge--groen">
                ${s.status}
              </span>
            </td>
            <td>
              <button class="kp-btn kp-btn--wijzigen"
                data-id="${s.id}" data-actie="wijzigen">
                Wijzigen
              </button>
            </td>
          </tr>
        `
                )
                .join('')
        }
      </tbody>
    </table>
  `;
}

function herrender() {
  document.getElementById('sectie-zonder').innerHTML =
    renderZonderDocent(zonderDocent);

  document.getElementById('sectie-gekoppeld').innerHTML =
    renderGekoppeld(gekoppeld);

  setupKnoppen();
}

// ================= MODAL =================
function openModal(stageId, actie) {
  const alleStudenten = [...zonderDocent, ...gekoppeld];
  const student = alleStudenten.find(s => s.id === stageId);
  if (!student) return;

  const modal = document.getElementById('kp-modal');

  document.getElementById('kp-modal-titel').textContent =
    actie === 'toewijzen'
      ? `Docent toewijzen aan ${student.naam}`
      : `Docent wijzigen voor ${student.naam}`;

  document.getElementById('kp-docent-select').innerHTML =
    beschikbareDocenten
      .map(
        d => `
        <option value="${d.user_id}"
          ${d.user_id === student.docent_id ? 'selected' : ''}>
          ${d.first_name} ${d.last_name}
        </option>
      `
      )
      .join('');

  modal.dataset.stageId = stageId;
  modal.classList.add('active');
}

function setupKnoppen() {
  document.querySelectorAll('.kp-btn[data-actie]').forEach(btn => {
    btn.addEventListener('click', () =>
      openModal(parseInt(btn.dataset.id), btn.dataset.actie)
    );
  });
}

// ================= MAIN RENDER =================
export async function renderKoppelingen(app) {
  app.innerHTML = `
    <div class="admin-layout">

      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>

        <nav class="sidebar-nav">
          <a href="#" class="nav-item" id="navGebruikers">Gebruikers</a>
          <a href="#" class="nav-item active" id="navKoppelingen">Koppelingen</a>
          <a href="#" class="nav-item" id="navDocumenten">Documenten</a>
          <a href="#" class="nav-item" id="navCompetenties">Competenties</a>
        </nav>

        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <button class="logout-link" id="kp-logout">Uitloggen</button>
        </div>
      </aside>

      <main class="main-content">
        <h1 class="page-title">Docent Koppelingen</h1>
        <section class="kp-sectie" id="sectie-zonder">
          <p class="loading">Laden...</p>
        </section>
        <section class="kp-sectie" id="sectie-gekoppeld"></section>
      </main>
    </div>

    <!-- Modal -->
    <div class="kp-modal-overlay" id="kp-modal">
      <div class="kp-modal">
        <h2 id="kp-modal-titel"></h2>

        <div>
          <label>Kies een docent</label>
          <select id="kp-docent-select"></select>
        </div>

        <div>
          <button id="kp-modal-opslaan">Opslaan</button>
          <button id="kp-modal-annuleren">Annuleren</button>
        </div>
      </div>
    </div>
  `;

  // ================= NAVIGATIE =================
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
  renderDocumenten(app);
});

// deze is current page → mag blijven of opnieuw renderen
document.getElementById('navCompetenties').addEventListener('click', (e) => {
  e.preventDefault();
  renderCompetenties(app);
});
  // ================= LOGOUT =================
  document.getElementById('kp-logout').addEventListener('click', async () => {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch {}

    document.cookie =
      'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

  // ================= MODAL EVENTS =================
  document.getElementById('kp-modal-annuleren').addEventListener('click', () => {
    document.getElementById('kp-modal').classList.remove('active');
  });

  document.getElementById('kp-modal').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('active');
  });

  document.getElementById('kp-modal-opslaan').addEventListener('click', async () => {
    const modal = document.getElementById('kp-modal');
    const stageId = parseInt(modal.dataset.stageId);
    const docentId = parseInt(
      document.getElementById('kp-docent-select').value
    );

    try {
      await slaDocentOp(stageId, docentId);
      modal.classList.remove('active');
      await loadData();
      herrender();
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message);
    }
  });

  // ================= INIT =================
  try {
    await loadData();
    herrender();
  } catch (err) {
    document.getElementById('sectie-zonder').innerHTML =
      `<p style="color:red;">Kan data niet laden: ${err.message}</p>`;
  }
}