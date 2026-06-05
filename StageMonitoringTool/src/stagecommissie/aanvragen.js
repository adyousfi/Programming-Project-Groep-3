import './aanvragen.css';
import { getAllAanvragen } from '../services/aanvragenService.js';

function statusLabel(status) {
  const labels = {
    in_afwachting: 'In afwachting',
    goedgekeurd:   'Goedgekeurd',
    afgekeurd:     'Afgekeurd',
    aanpassingen:  'Aanpassingen nodig',
  };
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
            <p class="sc-card-bedrijf">${a.bedrijf.naam}</p>
            <p class="sc-card-datum">Ingediend op: ${a.datum}</p>
            <button class="sc-card-btn" data-id="${a.id}" data-actie="${a.status === 'in_afwachting' ? 'beoordelen' : 'details'}">
              ${a.status === 'in_afwachting' ? 'Beoordelen' : 'Details Bekijken'}
            </button>
          </div>
          <span class="sc-badge sc-badge--${a.status}">${statusLabel(a.status)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupBeoordelen(aanvragen) {
  document.querySelectorAll('.sc-card-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = btn.dataset.id;
      const aanvraag = aanvragen.find(function(a) { return String(a.id) === id; });
      if (!aanvraag) return;
      if (btn.dataset.actie === 'details') {
        import('./beoordelen.js').then(function(m) { m.renderDetails(aanvraag); });
      } else {
        import('./beoordelen.js').then(function(m) { m.renderBeoordelen(aanvraag); });
      }
    });
  });
}

function setupFilter(aanvragen) {
  const navItems = document.querySelectorAll('.sc-nav-item');
  const kaartenDiv = document.querySelector('.sc-kaarten');

  navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      navItems.forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');

      const filter = item.dataset.filter;
      const gefilterd = filter === 'in_afwachting'
        ? aanvragen.filter(function(a) { return a.status === 'in_afwachting'; })
        : aanvragen;

      kaartenDiv.innerHTML = renderKaarten(gefilterd);
      setupBeoordelen(aanvragen);
    });
  });
}

export async function renderAanvragen() {
  const aanvragen = await getAllAanvragen();
  const aantalAfwachting = aanvragen.filter(function(a) { return a.status === 'in_afwachting'; }).length;

  document.querySelector('#app').innerHTML = `
    <div class="sc-layout">
      <aside class="sc-sidebar">
        <div class="sc-sidebar-top">
          <div class="sc-logo">
            <span class="sc-logo-title">Stagecommissie</span>
            <span class="sc-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sc-nav">
            <a href="#" class="sc-nav-item active" data-filter="in_afwachting">In afwachting <span class="sc-nav-count">${aantalAfwachting}</span></a>
            <a href="#" class="sc-nav-item" data-filter="alle">Alle aanvragen <span class="sc-nav-count">${aanvragen.length}</span></a>
          </nav>
        </div>
        <div class="sc-sidebar-bottom">
          <span class="sc-user-name">Prof. De Vries</span>
          <a href="/" class="sc-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="sc-main">
        <div class="sc-main-header">
          <h1 class="sc-main-title">Stage Aanvragen</h1>
          <p class="sc-main-sub">Beoordeel en keur stage voorstellen goed</p>
        </div>
        <div class="sc-kaarten">
          ${renderKaarten(aanvragen.filter(function(a) { return a.status === 'in_afwachting'; }))}
        </div>
      </main>
    </div>
  `;

  setupFilter(aanvragen);
  setupBeoordelen(aanvragen);
}
