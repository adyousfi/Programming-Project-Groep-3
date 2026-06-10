import './aanvragen.css';
import { renderBeoordelen } from './beoordelen.js';

const aanvragen = [
  {
    id: 1, naam: 'Lisa Peeters', studentEmail: 'lisa.peeters@student.ehb.be', functie: 'DevOps Engineer', datum: '28/4/2026', status: 'in_afwachting',
    bedrijf: { naam: 'CloudTech NV', adres: 'Brusselsestraat 100, 1000 Brussel', contactpersoon: 'Jan De Smedt', email: 'jan@cloudtech.be', telefoon: '0498 12 34 56' },
    stagementor: { naam: 'Jan De Smedt', email: 'jan@cloudtech.be', telefoon: '0498 12 34 56' },
    docent: { naam: 'Prof. De Vries', email: 'devries@ehb.be' },
    stageDetails: { omschrijving: 'Beheer van cloud infrastructuren en CI/CD pipelines.', start: '1/9/2026', einde: '31/1/2027', urenPerWeek: 38 }
  },
  {
    id: 2, naam: 'Tom Claes', studentEmail: 'tom.claes@student.ehb.be', functie: 'Mobile Developer', datum: '1/5/2026', status: 'in_afwachting',
    bedrijf: { naam: 'Mobile Apps Inc', adres: 'Keizerlaan 20, 1000 Brussel', contactpersoon: 'Sophie Peeters', email: 'sophie@mobileapps.be', telefoon: '0476 23 45 67' },
    stagementor: { naam: 'Sophie Peeters', email: 'sophie@mobileapps.be', telefoon: '0476 23 45 67' },
    docent: { naam: 'Prof. De Vries', email: 'devries@ehb.be' },
    stageDetails: { omschrijving: 'Ontwikkeling van cross-platform mobiele applicaties.', start: '1/9/2026', einde: '31/1/2027', urenPerWeek: 38 }
  },
  {
    id: 3, naam: 'Sara Janssen', studentEmail: 'sara.janssen@student.ehb.be', functie: 'Frontend Developer', datum: '3/5/2026', status: 'goedgekeurd',
    bedrijf: { naam: 'WebStudio BVBA', adres: 'Steenstraat 5, 1000 Brussel', contactpersoon: 'Peter Janssens', email: 'peter@webstudio.be', telefoon: '0456 34 56 78' },
    stagementor: { naam: 'Peter Janssens', email: 'peter@webstudio.be', telefoon: '0456 34 56 78' },
    docent: { naam: 'Prof. De Vries', email: 'devries@ehb.be' },
    stageDetails: { omschrijving: 'Bouwen van moderne web interfaces met React en Vue.', start: '1/9/2026', einde: '31/1/2027', urenPerWeek: 38 }
  },
];

const aantalAfwachting = aanvragen.filter(function(a) { return a.status === 'in_afwachting'; }).length;

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
            <p class="sc-card-bedrijf">${a.bedrijf.naam}</p>
            <p class="sc-card-datum">Ingediend op: ${a.datum}</p>
            <button class="sc-card-btn" data-id="${a.id}">Beoordelen</button>
          </div>
          <span class="sc-badge sc-badge--${a.status}">${statusLabel(a.status)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupBeoordelenButtons() {
  document.querySelectorAll('.sc-card-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = parseInt(btn.dataset.id);
      const aanvraag = aanvragen.find(function(a) { return a.id === id; });
      if (aanvraag) {
        renderBeoordelen(aanvraag);
      }
    });
  });
}

function setupFilter() {
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
      setupBeoordelenButtons();
    });
  });
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

  setupFilter();
  setupBeoordelenButtons();
}
