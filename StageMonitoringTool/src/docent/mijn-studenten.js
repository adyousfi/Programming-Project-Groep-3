import './mijn-studenten.css';

export function renderMijnStudenten() {
  document.querySelector('#app').innerHTML = `
    <div class="dc-layout">
      <aside class="dc-sidebar">
        <div class="dc-sidebar-top">
          <span class="dc-logo-title">EhB-docent</span>
          <span class="dc-logo-sub">Erasmushogeschool Brussel</span>
          <nav class="dc-nav">
            <a href="#" class="dc-nav-item active" data-filter="actief">Actieve stages</a>
            <a href="#" class="dc-nav-item" data-filter="alle">Alle studenten</a>
            <a href="#" class="dc-nav-item" data-filter="afgelopen">Afgelopen stages</a>
          </nav>
        </div>
        <div class="dc-sidebar-bottom">
          <span class="dc-user-name">Prof. Sarah Claes</span>
          <a href="/" class="dc-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="dc-main">
      </main>
    </div>
  `;
}
