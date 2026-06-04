import './aanvragen.css';

export function renderAanvragen() {
  document.querySelector('#app').innerHTML = `
    <div class="sc-layout">
      <aside class="sc-sidebar">
        <div class="sc-sidebar-top">
          <div class="sc-logo">
            <span class="sc-logo-title">Stagecommissie</span>
            <span class="sc-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sc-nav">
            <a href="#" class="sc-nav-item active">In afwachting <span class="sc-nav-count">2</span></a>
            <a href="#" class="sc-nav-item">Alle aanvragen <span class="sc-nav-count">3</span></a>
          </nav>
        </div>
        <div class="sc-sidebar-bottom">
          <span class="sc-user-name">Prof. De Vries</span>
          <a href="#" class="sc-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="sc-main"></main>
    </div>
  `;
}
