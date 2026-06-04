import './aanvragen.css';

const aanvragen = [
  { id: 1, naam: 'Lisa Peeters', functie: 'DevOps Engineer',  bedrijf: 'CloudTech NV',    datum: '28/4/2026', status: 'in_afwachting' },
  { id: 2, naam: 'Tom Claes',    functie: 'Mobile Developer', bedrijf: 'Mobile Apps Inc', datum: '1/5/2026',  status: 'in_afwachting' },
];

function statusLabel(status) {
  const labels = { in_afwachting: 'In afwachting', goedgekeurd: 'Goedgekeurd', afgekeurd: 'Afgekeurd' };
  return labels[status] || status;
}

function renderKaarten(lijst) {
  return lijst.map(function(a) {
    return `
      <div class="sc-card">
        <div class="sc-card-body">
          <div class="sc-card-info">
            <h2 class="sc-card-naam">${a.naam}</h2>
            <p class="sc-card-functie">${a.functie}</p>
            <p class="sc-card-bedrijf">${a.bedrijf}</p>
            <p class="sc-card-datum">Ingediend op: ${a.datum}</p>
            <button class="sc-card-btn">Beoordelen</button>
          </div>
          <span class="sc-badge sc-badge--${a.status}">${statusLabel(a.status)}</span>
        </div>
      </div>
    `;
  }).join('');
}

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
      <main class="sc-main">
        <div class="sc-main-header">
          <h1 class="sc-main-title">Stage Aanvragen</h1>
          <p class="sc-main-sub">Beoordeel en keur stage voorstellen goed</p>
        </div>
        <div class="sc-kaarten">
          ${renderKaarten(aanvragen)}
        </div>
      </main>
    </div>
  `;
}
