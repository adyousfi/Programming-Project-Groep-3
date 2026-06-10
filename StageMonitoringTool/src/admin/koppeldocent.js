import './koppeldocent.css';
import { renderAdmin } from './admin.js';

const beschikbareDocenten = [
  'Sarah Claes',
  'Jan De Smedt',
  'Lien Peeters',
  'Marc Willems',
];

let zonderDocent = [
  { id: 1, naam: 'Emma Willems', bedrijf: 'DataSoft Solutions', periode: '3 mrt - 30 jun 2026' },
];

let gekoppeld = [
  { id: 2, naam: 'Jan Janssens', bedrijf: 'TechCorp Belgium', periode: '3 feb - 30 mei 2026', docent: 'Sarah Claes', status: 'Actief' },
];

function renderZonderDocent(lijst) {
  return `
    <h3 class="kp-sectie-titel kp-sectie-titel--oranje">Studenten zonder docent (${lijst.length})</h3>
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
        ${lijst.length === 0
          ? `<tr><td colspan="5" style="padding:16px;color:#6b7280;">Geen studenten zonder docent.</td></tr>`
          : lijst.map(s => `
            <tr class="kp-rij--oranje">
              <td>${s.naam}</td>
              <td>${s.bedrijf}</td>
              <td>${s.periode}</td>
              <td><span class="kp-badge kp-badge--oranje">Geen docent toegewezen</span></td>
              <td><button class="kp-btn kp-btn--toewijzen" data-id="${s.id}" data-actie="toewijzen">Docent toewijzen</button></td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function renderGekoppeld(lijst) {
  return `
    <h3 class="kp-sectie-titel" style="margin-top: 32px;">Gekoppelde studenten (${lijst.length})</h3>
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
        ${lijst.length === 0
          ? `<tr><td colspan="6" style="padding:16px;color:#6b7280;">Geen gekoppelde studenten.</td></tr>`
          : lijst.map(s => `
            <tr>
              <td>${s.naam}</td>
              <td>${s.bedrijf}</td>
              <td>${s.periode}</td>
              <td>${s.docent}</td>
              <td><span class="kp-badge kp-badge--groen">${s.status}</span></td>
              <td><button class="kp-btn kp-btn--wijzigen" data-id="${s.id}" data-actie="wijzigen">Wijzigen</button></td>
            </tr>
          `).join('')}
      </tbody>
    </table>
  `;
}

function herrender() {
  document.getElementById('sectie-zonder').innerHTML = renderZonderDocent(zonderDocent);
  document.getElementById('sectie-gekoppeld').innerHTML = renderGekoppeld(gekoppeld);
  setupKnoppen();
}

function openModal(studentId, actie) {
  const alleStudenten = [...zonderDocent, ...gekoppeld];
  const student = alleStudenten.find(s => s.id === studentId);
  if (!student) return;

  const huidig = student.docent || '';

  const modal = document.getElementById('kp-modal');
  document.getElementById('kp-modal-titel').textContent =
    actie === 'toewijzen' ? `Docent toewijzen aan ${student.naam}` : `Docent wijzigen voor ${student.naam}`;
  document.getElementById('kp-docent-select').innerHTML =
    beschikbareDocenten.map(d => `<option value="${d}" ${d === huidig ? 'selected' : ''}>${d}</option>`).join('');

  modal.dataset.studentId = studentId;
  modal.classList.add('active');
}

function setupKnoppen() {
  document.querySelectorAll('.kp-btn[data-actie]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      openModal(parseInt(btn.dataset.id), btn.dataset.actie);
    });
  });
}

export function renderKoppelingen(app) {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="nav-item" id="navGebruikers">Gebruikers</a>
          <a href="#" class="nav-item active">Koppelingen</a>
          <a href="#" class="nav-item">Documenten</a>
          <a href="#" class="nav-item">Competenties</a>
        </nav>
        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <button class="logout-link" id="kp-logout">Uitloggen</button>
        </div>
      </aside>

      <main class="main-content">
        <h1 class="page-title" style="margin-bottom: 28px; text-align: left;">Docent Koppelingen</h1>
        <section class="kp-sectie" id="sectie-zonder">${renderZonderDocent(zonderDocent)}</section>
        <section class="kp-sectie" id="sectie-gekoppeld">${renderGekoppeld(gekoppeld)}</section>
      </main>
    </div>

    <!-- Modal -->
    <div class="kp-modal-overlay" id="kp-modal">
      <div class="kp-modal">
        <h2 class="kp-modal-titel" id="kp-modal-titel"></h2>
        <div class="kp-modal-body">
          <label class="kp-modal-label">Kies een docent</label>
          <select class="kp-modal-select" id="kp-docent-select"></select>
        </div>
        <div class="kp-modal-acties">
          <button class="btn-primary" id="kp-modal-opslaan">Opslaan</button>
          <button class="btn-cancel" id="kp-modal-annuleren">Annuleren</button>
        </div>
      </div>
    </div>
  `;

  setupKnoppen();

  document.getElementById('navGebruikers').addEventListener('click', function(e) {
    e.preventDefault();
    renderAdmin(app);
  });

  document.getElementById('kp-logout').addEventListener('click', async function() {
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

  document.getElementById('kp-modal-annuleren').addEventListener('click', function() {
    document.getElementById('kp-modal').classList.remove('active');
  });

  document.getElementById('kp-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  document.getElementById('kp-modal-opslaan').addEventListener('click', function() {
    const modal = document.getElementById('kp-modal');
    const studentId = parseInt(modal.dataset.studentId);
    const gekozenDocent = document.getElementById('kp-docent-select').value;

    const zonderIdx = zonderDocent.findIndex(s => s.id === studentId);
    if (zonderIdx !== -1) {
      const student = zonderDocent.splice(zonderIdx, 1)[0];
      student.docent = gekozenDocent;
      student.status = 'Actief';
      gekoppeld.push(student);
    } else {
      const gekIdx = gekoppeld.findIndex(s => s.id === studentId);
      if (gekIdx !== -1) gekoppeld[gekIdx].docent = gekozenDocent;
    }

    modal.classList.remove('active');
    herrender();
  });
}
