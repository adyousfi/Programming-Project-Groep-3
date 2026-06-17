import './koppeldocent.css';
import { renderAdmin } from './admin.js';
import { renderAdminDocumenten } from './adminDocumenten.js'; // check pad!
import { renderCompetenties } from './competenties.js';


const API_URL = 'http://localhost:3000';

let zonderDocent = [];
let gekoppeld = [];
let beschikbareDocenten = [];
let beschikbareMentors = [];
let stagesMetMentor = [];

// ================= DATA =================
async function loadData() {
  const stagesRes = await fetch(`${API_URL}/select-stage`);
  if (!stagesRes.ok) throw new Error('Fout bij laden stages');
  const stagesResult = await stagesRes.json();
  const stages = stagesResult.data || [];

  const docentenRes = await fetch(`${API_URL}/select-docent`);
  if (!docentenRes.ok) throw new Error('Fout bij laden docenten');
  const docentenResult = await docentenRes.json();
  const rawDocenten = docentenResult.data || [];

  beschikbareDocenten = rawDocenten.map(d => ({
    user_id: d.user_id,
    first_name: d.User?.first_name || '',
    last_name: d.User?.last_name || '',
  }));

  const usersRes = await fetch(`${API_URL}/select-user`);
  const usersResult = await usersRes.json();
  const allUsers = usersResult.data || [];
  beschikbareMentors = allUsers
    .filter(u => u.role === 'stagementor')
    .map(u => ({ user_id: u.user_id, first_name: u.first_name, last_name: u.last_name, is_active: u.is_active }));

  stagesMetMentor = stages
    .filter(s => s.stagementor_id)
    .map(s => {
      const studentUser = s.student?.User;
      const mentorUser = s.mentor?.User;
      return {
        id: s.stage_id,
        naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '-',
        bedrijf: s.bedrijf?.naam || '-',
        periode: formatPeriode(s.begin_datum, s.eind_datum),
        mentorNaam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '-',
        mentorEmail: mentorUser?.email || '-',
        mentorActief: mentorUser ? allUsers.find(u => u.email === mentorUser.email)?.is_active !== false : true,
        stagementor_id: s.stagementor_id,
      };
    });

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

function renderMentorBeheer(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top: 32px;">
      Mentor beheer (${lijst.length})
    </h3>
    <table class="kp-tabel">
      <thead>
        <tr>
          <th>Student</th>
          <th>Bedrijf</th>
          <th>Periode</th>
          <th>Mentor</th>
          <th>Status mentor</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>
        ${lijst.length === 0
          ? `<tr><td colspan="6" style="padding:16px;color:#6b7280;">Geen stages met mentor gevonden.</td></tr>`
          : lijst.map(s => `
            <tr>
              <td>${s.naam}</td>
              <td>${s.bedrijf}</td>
              <td>${s.periode}</td>
              <td>${s.mentorNaam}<br><small style="color:#6b7280">${s.mentorEmail}</small></td>
              <td>
                <span class="kp-badge ${s.mentorActief ? 'kp-badge--groen' : 'kp-badge--oranje'}">
                  ${s.mentorActief ? 'Actief' : 'Inactief (pending)'}
                </span>
              </td>
              <td style="display:flex;gap:6px;flex-wrap:wrap;">
                ${!s.mentorActief ? `<button class="kp-btn kp-btn--toewijzen" data-mentor-id="${s.stagementor_id}" data-actie="activeer-mentor">Activeer mentor</button>` : ''}
                <button class="kp-btn kp-btn--wijzigen" data-id="${s.id}" data-actie="wijzig-mentor">Wijzig mentor</button>
              </td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function herrender() {
  document.getElementById('sectie-zonder').innerHTML =
    renderZonderDocent(zonderDocent);

  document.getElementById('sectie-gekoppeld').innerHTML =
    renderGekoppeld(gekoppeld);

  document.getElementById('sectie-mentors').innerHTML =
    renderMentorBeheer(stagesMetMentor);

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
  document.querySelectorAll('.kp-btn[data-actie="toewijzen"], .kp-btn[data-actie="wijzigen"]').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id), btn.dataset.actie));
  });

  document.querySelectorAll('.kp-btn[data-actie="activeer-mentor"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const mentorId = btn.dataset.mentorId;
      if (!confirm('Mentor account activeren?')) return;
      const res = await fetch(`${API_URL}/toggle-user-active/${mentorId}`, { method: 'PATCH' });
      if (res.ok) { await loadData(); herrender(); }
      else alert('Fout bij activeren mentor');
    });
  });

  document.querySelectorAll('.kp-btn[data-actie="wijzig-mentor"]').forEach(btn => {
    btn.addEventListener('click', () => openMentorModal(parseInt(btn.dataset.id)));
  });
}

function openMentorModal(stageId) {
  const modal = document.getElementById('kp-mentor-modal');
  document.getElementById('kp-mentor-select').innerHTML = beschikbareMentors
    .map(m => `<option value="${m.user_id}">${m.first_name} ${m.last_name}${!m.is_active ? ' (inactief)' : ''}</option>`)
    .join('');
  modal.dataset.stageId = stageId;
  modal.classList.add('active');
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
        <h1 class="page-title">Koppelingen</h1>
        <section class="kp-sectie" id="sectie-zonder">
          <p class="loading">Laden...</p>
        </section>
        <section class="kp-sectie" id="sectie-gekoppeld"></section>
        <section class="kp-sectie" id="sectie-mentors"></section>
      </main>
    </div>

    <!-- Docent Modal -->
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

    <!-- Mentor Modal -->
    <div class="kp-modal-overlay" id="kp-mentor-modal">
      <div class="kp-modal">
        <h2 id="kp-mentor-modal-titel">Mentor wijzigen</h2>
        <div>
          <label>Kies een mentor</label>
          <select id="kp-mentor-select"></select>
        </div>
        <div>
          <button id="kp-mentor-modal-opslaan">Opslaan</button>
          <button id="kp-mentor-modal-annuleren">Annuleren</button>
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
  renderAdminDocumenten(app);
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

  document.getElementById('kp-mentor-modal-annuleren').addEventListener('click', () => {
    document.getElementById('kp-mentor-modal').classList.remove('active');
  });

  document.getElementById('kp-mentor-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  document.getElementById('kp-mentor-modal-opslaan').addEventListener('click', async () => {
    const modal = document.getElementById('kp-mentor-modal');
    const stageId = parseInt(modal.dataset.stageId);
    const mentorId = parseInt(document.getElementById('kp-mentor-select').value);
    try {
      const res = await fetch(`${API_URL}/api/stages/${stageId}/stagementor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stagementor_id: mentorId }),
      });
      if (res.ok) {
        modal.classList.remove('active');
        await loadData();
        herrender();
      } else {
        const err = await res.json().catch(() => ({}));
        alert('Fout bij opslaan: ' + (err.msg || 'Onbekende fout'));
      }
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