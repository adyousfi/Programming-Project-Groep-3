import './evaluatie.css';

let _userName = 'Docent';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#39;',
    }[c]));
}

function sidebarHtml(activePage) {
  const items = [
    { key: 'overzicht', label: 'Overzicht' },
    { key: 'stagedetails', label: 'Stagedetails' },
    { key: 'documenten', label: 'Documenten' },
    { key: 'logboek', label: 'Logboek' },
    { key: 'evaluatie', label: 'Evaluatie' },
  ];

  return `
    <aside class="sm-sidebar sm-sidebar--detail">
      <div class="sm-sidebar-top">
        <div class="sm-logo">
          <span class="sm-logo-title">Stage Monitoring</span>
          <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
        </div>
        <nav class="sm-nav sm-nav--detail">
          ${items.map(i => `<a class="sm-nav-item ${i.key === activePage ? 'active' : ''}" data-page="${i.key}" href="#">${i.label}</a>`).join('')}
        </nav>
      </div>
      <div class="sm-sidebar-bottom">
        <span class="sm-user-name">${_userName}</span>
        <a class="sm-logout" href="#">Uitloggen</a>
      </div>
    </aside>
  `;
}

function attachNav(app, stagiair) {
  // Zorg dat de correcte tab ook meteen zichtbaar is wanneer vanuit een andere view naar evaluatie
  // wordt genavigeerd (via hash).
  const m = (window.location.hash || '').match(/^#docent-evaluatie-(tussentijds|finale)$/);
  const initialTab = m ? m[1] : 'tussentijds';
  if (initialTab) {
    // Alleen renderen als we nog niet op de evaluatie UI zitten.
    // (renderEvaluatiePage bouwt de hele pagina opnieuw.)
    // We renderen altijd op # evaluatie klik later; hier enkel initialiseren bij laden.
  }

  document.querySelectorAll('.sm-nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      if (page === 'evaluatie') {
        // default: tussentijds voor docent UI
        renderEvaluatiePage(app, stagiair, 'tussentijds');
      }
    });
  });
}

function renderEvaluatiePage(app, stagiair, activeTab = 'tussentijds') {
  const scores = [1, 2, 3, 4, 5];

  const descriptions =
    activeTab === 'finale'
      ? {
          1: '{c} is op het einde van de stage onvoldoende beheerst; het eindniveau wordt niet gehaald.',
          2: '{c} blijft net onder het verwachte eindniveau; er zijn nog duidelijke tekortkomingen.',
          3: '{c} wordt op eindniveau voldoende beheerst, maar met beperkte zelfstandigheid.',
          4: '{c} wordt op eindniveau goed beheerst, met zelfstandig en consistent werk.',
          5: '{c} wordt op eindniveau uitstekend beheerst, met initiatief, reflectie en meerwaarde voor het team.',
        }
      : {
          1: '{c} is niet of onvoldoende aangetoond binnen de verwachtingen van de stage.',
          2: '{c} is nipt aanwezig; belangrijke aspecten ontbreken of zijn nog onzeker.',
          3: '{c} wordt voldoende uitgevoerd, maar nog niet volledig zelfstandig of consistent.',
          4: '{c} wordt correct uitgevoerd, met af en toe lichte begeleiding of bijsturing nodig.',
          5: '{c} wordt zelfstandig en boven de verwachtingen uitgevoerd, met initiatief en reflectie.',
        };

  const competenties = [
    { key: 'planningsproces', title: 'Beheersing van het planningsproces', description: 'De student kan zelfstandig een planning opstellen en opvolgen.' },
    { key: 'it-oplossingen', title: 'Ontwerpen IT-oplossingen', description: 'De student kan IT-oplossingen ontwerpen op basis van een probleemanalyse.' },
    { key: 'digitale-producten', title: 'Implementatie digitale producten', description: 'De student kan digitale producten bouwen en implementeren.' },
    { key: 'communicatie', title: 'Helder en transparant communiceren', description: 'De student communiceert professioneel met stakeholders.' },
    { key: 'persoonlijke-ontwikkeling', title: 'Persoonlijke ontwikkeling', description: 'De student werkt actief aan zijn persoonlijke en professionele groei.' },
  ];

  const pageTitle = 'Evaluatie';
  const pageSubtitle = 'Evalueer de stagiair op basis van competenties';

  const blockTitle = activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking';
  const blockDesc = activeTab === 'finale'
    ? 'Geef per competentie een finale score en feedback.'
    : 'Geef per competentie een score en feedback.';

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('evaluatie')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div>
            <h1 class="sm-detail-title">${pageTitle}</h1>
            <p class="sm-detail-subtitle">${pageSubtitle}</p>
          </div>
          <a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
        </div>

        <div class="sm-eval-tabs">
          <button class="sm-eval-tab ${activeTab === 'tussentijds' ? 'active' : ''}" data-tab="tussentijds">Tussentijdse evaluatie</button>
          <button class="sm-eval-tab ${activeTab === 'finale' ? 'active' : ''}" data-tab="finale">Finale evaluatie</button>
        </div>

        <div class="sm-eval-block">
          <div class="sm-eval-block-header">
            <h3>${blockTitle}</h3>
            <p>${blockDesc}</p>
            <p class="sm-eval-datum" style="margin-top:6px;color:#6b7280;">
              Datum evaluatie: <strong>${new Date().toLocaleDateString('nl-BE')}</strong>
            </p>
          </div>



          ${competenties.map((comp) => `
            <div class="sm-eval-competentie">
              <h3 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">${escapeHtml(comp.title)}</h3>
              <p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(comp.description)}</p>

              <div>
                <span class="sm-score-title">Hoe scoor je deze competentie? Klik op een score (1 = laag, 5 = hoog)</span>
                <div class="sm-eval-score-cards">
                  ${scores.map((score) => `
                    <button type="button" class="sm-score-card sm-score-card--${score}" data-score="${score}" data-competentie="${comp.key}">
                      <span class="sm-score-card-number">${score}</span>
                      <span class="sm-score-card-text">${descriptions[score].replace('{c}', escapeHtml(comp.title))}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="sm-eval-mentor-panel">
                <h4>Feedback (docent)</h4>
                <label class="sm-eval-feedback-label" for="feedback-${comp.key}">Feedback</label>
                <textarea id="feedback-${comp.key}" class="sm-eval-feedback" placeholder="Beschrijf je feedback over de vorderingen van de student..."></textarea>
              </div>
            </div>
          `).join('')}

          <div class="sm-eval-actions">
            <button id="sm-eval-save" class="sm-button">Beoordeling Opslaan</button>
          </div>
          <p id="sm-eval-save-message" class="sm-eval-save-message hidden">Evaluatie opgeslagen.</p>
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back-evaluatie')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Gebruik dezelfde route als jullie side-menu: studenten/stagedetails/docenten delen vaak dezelfde app-routing.
    // Als jullie een specifieke docent URL hebben, kan dit later aangepast worden.
    window.location.href = '#';
  });

  attachNav(app, stagiair);

  // Selecteer score UI
  document.querySelectorAll('.sm-score-card').forEach((card) => {
    card.addEventListener('click', () => {
      const container = card.closest('.sm-eval-score-cards');
      if (!container) return;
      container.querySelectorAll('.sm-score-card').forEach((b) => b.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Tabs wisselen
  document.querySelectorAll('.sm-eval-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      // “Link”-gedrag: render meteen én zet een hash zodat je route/URL zichtbaar is.
      const tabName = tab.dataset.tab;
      window.location.hash = `#docent-evaluatie-${tabName}`;
      renderEvaluatiePage(app, stagiair, tabName);
    });
  });

  // Save UI
  document.querySelector('#sm-eval-save')?.addEventListener('click', () => {
    const msg = document.querySelector('#sm-eval-save-message');
    if (msg) {
      msg.textContent = 'Evaluatie opgeslagen.';
      msg.classList.remove('hidden');
    }
  });
}

export async function renderEvaluatieDocent(app, user) {
  _userName = user && user.last_name
    ? `${user.last_name.toUpperCase()} ${user.first_name}`
    : user?.first_name || 'Docent';

  // TODO: koppel echte stagiair data via juiste API endpoint.
  const dummyStagiair = user?.stagiair || { naam: 'Stagiair', email: 'student@example.com' };
  renderEvaluatiePage(app, dummyStagiair, 'tussentijds');
}

