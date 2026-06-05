import './mijn-stagiairs.css';

const stagiairs = [
  {
    naam: 'Jan Janssens',
    functie: 'Frontend Developer',
    email: 'jan.janssens@student.ehb.be',
    bedrijf: 'TechCorp Belgium',
    bedrijfFunctie: 'Frontend Developer',
    start: '3 feb',
    einde: '30 mei',
    totalWeeks: 16,
    currentWeek: 2,
    badges: [
      {type: 'warning', label: '2 logboeken te controleren'},
      {type: 'danger', label: 'Handtekening vereist'},
    ],
  },
  {
    naam: 'Sarah Vermeulen',
    functie: 'UX Designer',
    email: 'sarah.vermeulen@student.ehb.be',
    bedrijf: 'DesignHub',
    bedrijfFunctie: 'UX Designer',
    start: '1 mrt',
    einde: '30 jun',
    totalWeeks: 17,
    currentWeek: 5,
    badges: [],
  },
];

function renderBadge(badge) {
  return `<span class="sm-badge sm-badge--${badge.type}">${badge.label}</span>`;
}

function renderStagiairKaart(stagiair, index) {
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
        <button class="sm-button" data-index="${index}">Student Bekijken</button>
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

function renderStudentDetail(app, stagiair) {
  app.innerHTML = `
    <div class="sm-layout">
      <aside class="sm-sidebar sm-sidebar--detail">
        <div class="sm-sidebar-top">
          <div class="sm-logo">
            <span class="sm-logo-title">Stage Monitoring</span>
            <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sm-nav sm-nav--detail">
            <a href="#" class="sm-nav-item active">Overzicht</a>
            <a href="#" class="sm-nav-item">Stagedetails</a>
            <a href="#" class="sm-nav-item">Documenten</a>
            <a href="#" class="sm-nav-item">Logboek</a>
            <a href="#" class="sm-nav-item">Evaluatie</a>
          </nav>
        </div>
        <div class="sm-sidebar-bottom">
          <span class="sm-user-name">Mieke Peeters</span>
          <a href="#" class="sm-logout" id="sm-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <a href="#" class="sm-detail-back" id="sm-back">← Terug naar stagiairs</a>
          <div>
            <h1 class="sm-detail-title">Stagiair: ${stagiair.naam}</h1>
            <p class="sm-detail-email">${stagiair.email}</p>
          </div>
        </div>
        <div class="sm-detail-grid">
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Stage Periode</p>
            <p class="sm-detail-card-value">${stagiair.start} - ${stagiair.einde}</p>
            <p class="sm-detail-card-meta">${stagiair.totalWeeks} weken totaal</p>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Logboek Status</p>
            <p class="sm-detail-card-value">${stagiair.currentWeek} / ${stagiair.totalWeeks} weken</p>
            <div class="sm-progress">
              <div class="sm-progress-bar" style="width: ${Math.round((stagiair.currentWeek / stagiair.totalWeeks) * 100)}%"></div>
            </div>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Bedrijf</p>
            <p class="sm-detail-card-value">${stagiair.bedrijf}</p>
            <p class="sm-detail-card-meta">${stagiair.bedrijfFunctie}</p>
          </div>
        </div>
        <div class="sm-detail-actions">
          <div class="sm-action-card">
            <span class="sm-action-icon">📘</span>
            <div>
              <p class="sm-action-title">Logboek Controleren</p>
              <p class="sm-action-text">Bekijk dagelijkse activiteiten</p>
            </div>
          </div>
          <div class="sm-action-card">
            <span class="sm-action-icon">📝</span>
            <div>
              <p class="sm-action-title">Evaluaties</p>
              <p class="sm-action-text">Geef feedback en beoordeling</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back').addEventListener('click', function(event) {
    event.preventDefault();
    renderStagementorPage(app);
  });
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

  setupStudentLinks(app);
}

function setupStudentLinks() {
  document.querySelectorAll('.sm-button').forEach(function(button) {
    button.addEventListener('click', function() {
      const index = Number(button.dataset.index);
      const stagiair = stagiairs[index];
      renderStudentDetail(document.querySelector('#app'), stagiair);
    });
  });
}

export function renderMijnStagiairs(app) {
  renderStagementorPage(app);
}
