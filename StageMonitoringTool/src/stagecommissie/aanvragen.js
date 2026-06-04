import './aanvragen.css';

const aanvragen = [
  {
    id: 1, naam: 'Lisa Peeters', functie: 'DevOps Engineer', datum: '28/4/2026', status: 'in_afwachting',
    studentEmail: 'lisa.peeters@student.ehb.be',
    bedrijf: { naam: 'CloudTech NV', adres: 'Technologielaan 45, 9000 Gent', contactpersoon: 'Mark Janssen', email: 'mark@cloudtech.be', telefoon: '+32 9 234 56 78' },
    stagementor: { naam: 'Sophie De Smet', email: 'sophie.desmet@cloudtech.be', telefoon: '+32 9 234 56 79' },
    docent: { naam: 'Prof. Sarah Claes', email: 'sarah.claes@ehb.be' },
    stageDetails: { omschrijving: 'De stagiair zal helpen bij het opzetten van CI/CD pipelines, container orchestratie met Kubernetes, en infrastructure as code met Terraform. Werken in een Agile team.', start: '1/3/2026', einde: '30/6/2026', urenPerWeek: 40 },
  },
  {
    id: 2, naam: 'Tom Claes', functie: 'Mobile Developer', datum: '1/5/2026', status: 'in_afwachting',
    studentEmail: 'tom.claes@student.ehb.be',
    bedrijf: { naam: 'Mobile Apps Inc', adres: 'Antwerpsesteenweg 12, 2000 Antwerpen', contactpersoon: 'Jan De Backer', email: 'jan@mobileapps.be', telefoon: '+32 3 123 45 67' },
    stagementor: { naam: 'Lien Vermeersch', email: 'lien@mobileapps.be', telefoon: '+32 3 123 45 68' },
    docent: { naam: 'Prof. Koen Martens', email: 'koen.martens@ehb.be' },
    stageDetails: { omschrijving: 'Ontwikkeling van een cross-platform mobiele applicatie met React Native voor iOS en Android.', start: '1/3/2026', einde: '30/6/2026', urenPerWeek: 40 },
  },
  {
    id: 3, naam: 'Sara Janssen', functie: 'Frontend Developer', datum: '3/5/2026', status: 'goedgekeurd',
    studentEmail: 'sara.janssen@student.ehb.be',
    bedrijf: { naam: 'WebStudio BVBA', adres: 'Brusselsestraat 88, 3000 Leuven', contactpersoon: 'Peter Wouters', email: 'peter@webstudio.be', telefoon: '+32 16 987 65 43' },
    stagementor: { naam: 'Els Peeters', email: 'els@webstudio.be', telefoon: '+32 16 987 65 44' },
    docent: { naam: 'Prof. An Vermeulen', email: 'an.vermeulen@ehb.be' },
    stageDetails: { omschrijving: 'Bouwen van moderne webinterfaces met Vue.js en het optimaliseren van de gebruikerservaring voor bestaande klanten.', start: '1/3/2026', einde: '30/6/2026', urenPerWeek: 38 },
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

function setupBeoordelen() {
  document.querySelectorAll('.sc-card-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = parseInt(btn.dataset.id);
      const aanvraag = aanvragen.find(function(a) { return a.id === id; });
      if (btn.dataset.actie === 'details') {
        import('./beoordelen.js').then(function(m) { m.renderDetails(aanvraag); });
      } else {
        import('./beoordelen.js').then(function(m) { m.renderBeoordelen(aanvraag); });
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
      setupBeoordelen();
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
          <a href="#" class="sc-logout">Uitloggen</a>
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
  setupBeoordelen();
}
