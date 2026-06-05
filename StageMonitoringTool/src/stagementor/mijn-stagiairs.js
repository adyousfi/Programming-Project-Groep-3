import './mijn-stagiairs.css';

const sections = {
  'mijn-stagiairs': 'Mijn Stagiairs',
};

const stagiairs = [
  {
    naam: 'Jan Janssens',
    functie: 'Frontend Developer',
    email: 'jan.janssens@student.ehb.be',
    start: '1/2/2026',
    einde: '31/5/2026',
    badges: [
      {type: 'warning', label: '2 logboeken te controleren'},
      {type: 'danger', label: 'Handtekening vereist'},
    ],
  },
  {
    naam: 'Sarah Vermeulen',
    functie: 'UX Designer',
    email: 'sarah.vermeulen@student.ehb.be',
    start: '1/3/2026',
    einde: '30/6/2026',
    badges: [],
  },
];

function renderBadge(badge) {
  return `<span class="sm-badge sm-badge--${badge.type}">${badge.label}</span>`;
}

function renderStagiairKaart(stagiair) {
  return `
    <div class="sm-stagiair-card">
      <div class="sm-stagiair-row">
        <div>
          <h2 class="sm-stagiair-naam">${stagiair.naam}</h2>
          <p class="sm-stagiair-functie">${stagiair.functie}</p>
          <p class="sm-stagiair-email">${stagiair.email}</p>
        </div>
        <div class="sm-stagiair-badges">
          ${stagiair.badges.map(renderBadge).join('')}
        </div>
      </div>
      <div class="sm-stagiair-bottom">
        <div class="sm-stagiair-dates">
          <div><span class="sm-stagiair-label">Start:</span> ${stagiair.start}</div>
          <div><span class="sm-stagiair-label">Einde:</span> ${stagiair.einde}</div>
        </div>
        <button class="sm-button">Student Bekijken</button>
      </div>
    </div>
  `;
}

function renderSectionContent() {
  return `
    <div class="sm-stagiair-list">
      <p class="sm-welcome">Welkom, Mieke Peeters</p>
      ${stagiairs.map(renderStagiairKaart).join('')}
    </div>
  `;
}

function renderStagementorPage(app) {
  app.innerHTML = `
    <div class="sm-layout">
      <aside class="sm-sidebar">
        <div class="sm-sidebar-top">
          <div class="sm-logo">
            <span class="sm-logo-title">Stagementor</span>
            <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sm-nav">
            <a href="#" class="sm-nav-item active">Mijn Stagiairs</a>
          </nav>
        </div>
        <div class="sm-sidebar-bottom">
          <span class="sm-user-name">Mieke Peeters</span>
          <a href="#" class="sm-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="sm-main">
        <div class="sm-main-header">
          <h1 class="sm-main-title">Mijn Stagiairs</h1>
        </div>
        <div class="sm-content">
          ${renderSectionContent()}
        </div>
      </main>
    </div>
  `;
}

export function renderMijnStagiairs(app) {
  renderStagementorPage(app, 'mijn-stagiairs');
}
