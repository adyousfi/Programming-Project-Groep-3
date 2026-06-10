import './koppeldocent.css';
import { renderAdmin } from './admin.js';

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

        <section class="kp-sectie" id="sectie-zonder"></section>
        <section class="kp-sectie" id="sectie-gekoppeld"></section>
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
