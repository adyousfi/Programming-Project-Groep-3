import './koppeldocent.css';
import { renderAdmin } from './admin.js';

const zonderDocent = [
  { id: 1, naam: 'Emma Willems',  bedrijf: 'DataSoft Solutions', periode: '3 mrt - 30 jun 2026' },
];

const gekoppeld = [
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
        ${lijst.map(s => `
          <tr class="kp-rij--oranje">
            <td>${s.naam}</td>
            <td>${s.bedrijf}</td>
            <td>${s.periode}</td>
            <td><span class="kp-badge kp-badge--oranje">Geen docent toegewezen</span></td>
            <td><button class="kp-btn kp-btn--toewijzen" data-id="${s.id}">Docent toewijzen</button></td>
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
        ${lijst.map(s => `
          <tr>
            <td>${s.naam}</td>
            <td>${s.bedrijf}</td>
            <td>${s.periode}</td>
            <td>${s.docent}</td>
            <td><span class="kp-badge kp-badge--groen">${s.status}</span></td>
            <td><button class="kp-btn kp-btn--wijzigen" data-id="${s.id}">Wijzigen</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
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
        <h1 class="page-title" style="margin-bottom: 28px;">Docent Koppelingen</h1>

        <section class="kp-sectie" id="sectie-zonder">${renderZonderDocent(zonderDocent)}</section>
        <section class="kp-sectie" id="sectie-gekoppeld">${renderGekoppeld(gekoppeld)}</section>
      </main>
    </div>
  `;

  document.getElementById('navGebruikers').addEventListener('click', function(e) {
    e.preventDefault();
    renderAdmin(app);
  });

  document.getElementById('kp-logout').addEventListener('click', async function() {
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });
}
