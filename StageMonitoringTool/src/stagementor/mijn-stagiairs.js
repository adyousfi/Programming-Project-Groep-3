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
      { type: 'warning', label: '2 logboeken te controleren' },
      { type: 'danger', label: 'Handtekening vereist' },
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

const competenties = [
  { key: 'planningsproces', title: 'Beheersing van het planningsproces', description: 'De student kan zelfstandig een planning opstellen en opvolgen.' },
  { key: 'it-oplossingen', title: 'Ontwerpen IT-oplossingen', description: 'De student kan IT-oplossingen ontwerpen op basis van een probleemanalyse.' },
  { key: 'digitale-producten', title: 'Implementatie digitale producten', description: 'De student kan digitale producten bouwen en implementeren.' },
  { key: 'communicatie', title: 'Helder en transparant communiceren', description: 'De student communiceert professioneel met stakeholders.' },
  { key: 'persoonlijke-ontwikkeling', title: 'Persoonlijke ontwikkeling', description: 'De student werkt actief aan zijn persoonlijke en professionele groei.' },
];

// storage helpers
function smIsWeekAfgevinkt(email, week) { try { return localStorage.getItem(`sm_afgevinkt_${email}_${week}`) === '1'; } catch { return false; } }
function smSetWeekAfgevinkt(email, week) { try { localStorage.setItem(`sm_afgevinkt_${email}_${week}`, '1'); } catch {} }
function smGetWeekComment(email, week) { try { return localStorage.getItem(`sm_comment_${email}_${week}`) || ''; } catch { return ''; } }
function smSaveWeekComment(email, week, text) { try { localStorage.setItem(`sm_comment_${email}_${week}`, text); } catch {} }
function smGetEvaluationScore(email, type, c) { try { return localStorage.getItem(`sm_eval_score_${email}_${type}_${c}`) || ''; } catch { return ''; } }
function smSaveEvaluationScore(email, type, c, s) { try { localStorage.setItem(`sm_eval_score_${email}_${type}_${c}`, String(s)); } catch {} }
function smGetEvaluationFeedback(email, type, c) { try { return localStorage.getItem(`sm_eval_feedback_${email}_${type}_${c}`) || ''; } catch { return ''; } }
function smSaveEvaluationFeedback(email, type, c, t) { try { localStorage.setItem(`sm_eval_feedback_${email}_${type}_${c}`, t); } catch {} }

function escapeHtml(s) {
  return String(s).replace(/[&<<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
        <span class="sm-user-name">Mieke Peeters</span>
        <a class="sm-logout" href="#">Uitloggen</a>
      </div>
    </aside>
  `;
}

function renderBadge(b) {
  const cls = b.type === 'danger' ? 'sm-badge--danger' : 'sm-badge--warning';
  return `<span class="sm-badge ${cls}">${escapeHtml(b.label)}</span>`;
}

function renderStagiairKaart(s, index) {
  return `
    <article class="sm-stagiair-card">
      <div class="sm-stagiair-row">
        <div>
          <h2 class="sm-stagiair-naam">${escapeHtml(s.naam)}</h2>
          <p class="sm-stagiair-functie">${escapeHtml(s.functie)}</p>
          <p class="sm-stagiair-email">${escapeHtml(s.email)}</p>
        </div>
        <div class="sm-stagiair-badges">
          ${s.badges.map(renderBadge).join('')}
        </div>
      </div>
      <div class="sm-stagiair-bottom">
        <div class="sm-stagiair-dates">
          <div><span class="sm-stagiair-label">Start: </span><span class="sm-stagiair-value">${escapeHtml(s.start)}</span></div>
          <div><span class="sm-stagiair-label">Einde: </span><span class="sm-stagiair-value">${escapeHtml(s.einde)}</span></div>
        </div>
        <button class="sm-button" data-index="${index}">Student Bekijken</button>
      </div>
    </article>
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
            <a class="sm-nav-item active" href="#">Mijn Stagiairs</a>
          </nav>
        </div>
        <div class="sm-sidebar-bottom">
          <span class="sm-user-name">Mieke Peeters</span>
          <a class="sm-logout" href="#">Uitloggen</a>
        </div>
      </aside>
      <main class="sm-main">
        <header class="sm-main-header">
          <h1 class="sm-main-title">Mijn Stagiairs</h1>
          <p class="sm-welcome">Welkom, Mieke Peeters</p>
        </header>
        <section class="sm-content">
          <div class="sm-stagiair-list">
            ${stagiairs.map(renderStagiairKaart).join('')}
          </div>
        </section>
      </main>
    </div>
  `;

  document.querySelectorAll('.sm-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      renderStudentDetail(app, stagiairs[idx]);
    });
  });
}

function attachNav(app, stagiair) {
  document.querySelectorAll('.sm-nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page === 'logboek') renderLogboekOverview(app, stagiair);
      else if (page === 'evaluatie') renderEvaluatiePage(app, stagiair, 'tussentijds');
      else if (page === 'overzicht') renderStudentDetail(app, stagiair);
    });
  });
}

function renderStudentDetail(app, stagiair) {
  const progressPct = Math.round((stagiair.currentWeek / stagiair.totalWeeks) * 100);
  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('overzicht')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div>
            <a id="sm-back" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
            <h1 class="sm-detail-title">Stagiair: ${escapeHtml(stagiair.naam)}</h1>
            <p class="sm-detail-email">${escapeHtml(stagiair.email)}</p>
          </div>
        </div>
        <div class="sm-detail-grid">
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Stage Periode</p>
            <p class="sm-detail-card-value">${escapeHtml(stagiair.start)} - ${escapeHtml(stagiair.einde)}</p>
            <p class="sm-detail-card-meta">${stagiair.totalWeeks} weken totaal</p>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Logboek Status</p>
            <p class="sm-detail-card-value">${stagiair.currentWeek} / ${stagiair.totalWeeks} weken</p>
            <div class="sm-progress"><div class="sm-progress-bar" style="width:${progressPct}%"></div></div>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Bedrijf</p>
            <p class="sm-detail-card-value">${escapeHtml(stagiair.bedrijf)}</p>
            <p class="sm-detail-card-meta">${escapeHtml(stagiair.bedrijfFunctie)}</p>
          </div>
        </div>
        <div class="sm-detail-actions">
          <div class="sm-action-card" data-action="logboek">
            <span class="sm-action-icon">📘</span>
            <div>
              <h3 class="sm-action-title">Logboek Controleren</h3>
              <p class="sm-action-text">Bekijk dagelijkse activiteiten</p>
            </div>
          </div>
          <div class="sm-action-card" data-action="evaluaties">
            <span class="sm-action-icon">📝</span>
            <div>
              <h3 class="sm-action-title">Evaluaties</h3>
              <p class="sm-action-text">Geef feedback en beoordeling</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back').addEventListener('click', (e) => { e.preventDefault(); renderStagementorPage(app); });
  attachNav(app, stagiair);
  document.querySelectorAll('.sm-action-card').forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      if (action === 'logboek') renderLogboekOverview(app, stagiair);
      else if (action === 'evaluaties') renderEvaluatiePage(app, stagiair, 'tussentijds');
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





  const pageTitle = 'Evaluatie';
  const pageSubtitle = 'Evalueer de stagiair op basis van competenties';
  const blockTitle = activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking';
  const blockDesc = activeTab === 'finale'
    ? 'Geef per competentie een finale score en feedback. De student geeft ook zelf een score — de docent ziet beide en bepaalt het definitieve punt.'
    : 'Geef per competentie een score en feedback. De student geeft ook zelf een score — de docent ziet beide en bepaalt het finale punt.';

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
          </div> 

${competenties.map((comp) => `
  <div class="sm-eval-competentie">
       
              <h3 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">${escapeHtml(comp.title)}</h3>
              <p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(comp.description)}</p>
              <div>
                <span class="sm-score-title">Hoe scoor je deze competentie? Klik op een score (1 = laag, 5 = hoog)</span>
                <div class="sm-eval-score-cards" data-competentie="${comp.key}">
                  ${scores.map((score) => `
                    <button type="button" class="sm-score-card sm-score-card--${score}" data-score="${score}" data-competentie="${comp.key}">
                      <span class="sm-score-card-number">${score}</span>
                      <span class="sm-score-card-text">${descriptions[score].replace('{c}', escapeHtml(comp.title))}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
              <div class="sm-eval-mentor-panel">
                <h4>Jouw beoordeling (mentor)</h4>
                <label class="sm-eval-feedback-label" for="feedback-${comp.key}">Feedback</label>
                <textarea id="feedback-${comp.key}" class="sm-eval-feedback" placeholder="Beschrijf je feedback over de vorderingen van de student...">${escapeHtml(smGetEvaluationFeedback(stagiair.email, activeTab, comp.key))}</textarea>
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

  document.querySelector('#sm-back-evaluatie').addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);

  document.querySelectorAll('.sm-score-card').forEach((card) => {
    const existing = smGetEvaluationScore(stagiair.email, activeTab, card.dataset.competentie);
    if (existing && existing === card.dataset.score) card.classList.add('selected');
    card.addEventListener('click', () => {
      const container = card.closest('.sm-eval-score-cards');
      if (!container) return;
      container.querySelectorAll('.sm-score-card').forEach((b) => b.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  document.querySelectorAll('.sm-eval-tab').forEach((tab) => {
    tab.addEventListener('click', () => renderEvaluatiePage(app, stagiair, tab.dataset.tab));
  });

  document.querySelector('#sm-eval-save').addEventListener('click', () => {
    document.querySelectorAll('.sm-eval-score-cards').forEach((container) => {
      const compKey = container.dataset.competentie;
      const selected = container.querySelector('.sm-score-card.selected');
      if (selected) smSaveEvaluationScore(stagiair.email, activeTab, compKey, Number(selected.dataset.score));
      const fb = document.querySelector(`#feedback-${compKey}`);
      if (fb) smSaveEvaluationFeedback(stagiair.email, activeTab, compKey, fb.value.trim());
    });
    const msg = document.querySelector('#sm-eval-save-message');
    if (msg) { msg.textContent = 'Evaluatie opgeslagen.'; msg.classList.remove('hidden'); }
  });
}

function renderLogboekOverview(app, stagiair) {
  const weeks = Array.from({ length: stagiair.totalWeeks }, (_, i) => {
    const weekNum = i + 1;
    const afgevinkt = smIsWeekAfgevinkt(stagiair.email, weekNum);
    const filled = afgevinkt ? 5 : (weekNum <= stagiair.currentWeek ? 5 : 0);
    const status = afgevinkt ? 'Afgevinkt' : (filled === 5 ? 'Ingevuld' : 'Nog niet afgevinkt');
    return { weekNum, dateRange: `${stagiair.start} t/m ${stagiair.einde}`, filled, total: 5, status, afgevinkt };
  });

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('logboek')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div>
            <a id="sm-back-logboek" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
            <h1 class="sm-detail-title">Logboek - Weekoverzicht</h1>
            <p class="sm-detail-subtitle">Bekijk en controleer de wekelijkse logboeken van ${escapeHtml(stagiair.naam)}</p>
          </div>
        </div>
        <div class="sm-logboek-list">
          ${weeks.map((w) => {
            const pct = (w.filled / w.total) * 100;
            const statusClass = w.afgevinkt ? 'sm-status--ok' : (w.filled === w.total ? 'sm-status--ok' : 'sm-status--pending');
            return `
              <div class="sm-week-card" data-week="${w.weekNum}">
                <div class="sm-week-left">
                  <h3>Week ${w.weekNum}</h3>
                  <p class="sm-week-dates">${w.dateRange}</p>
                </div>
                <div class="sm-week-right">
                  <span class="sm-week-progress-text">${w.filled}/${w.total} dagen ingevuld</span>
                  <div class="sm-week-progress"><div class="sm-week-progress-bar" style="width:${pct}%"></div></div>
                  <span class="sm-status-badge ${statusClass}">${w.status}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back-logboek').addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);
  document.querySelectorAll('.sm-week-card').forEach((card) => {
    card.addEventListener('click', () => renderWeekDetail(app, stagiair, Number(card.dataset.week)));
  });
}

function renderWeekDetail(app, stagiair, weekNum) {
  const days = [
    { name: 'Maandag', date: '3 feb', status: 'Ingediend', tasks: 'Vandaag heb ik gewerkt aan het opzetten van de ontwikkelomgeving en kennismaking met het team. We hebben een kickoff meeting gehad waar de projectdoelen werden toegelicht.', reflection: 'Ik heb geleerd hoe belangrijk goede communicatie is binnen een team. Het was interessant om te zien hoe professionele projecten worden opgezet.', problems: 'Geen bijzondere problemen. Wel veel nieuwe informatie in korte tijd.' },
    { name: 'Dinsdag', date: '4 feb', status: 'Ingediend', tasks: 'Afronding van de bugfix en deployment naar test omgeving. Retrospective meeting met het team over de afgelopen sprint.', reflection: 'Eerste week succesvol afgerond. Ik voel me meer onderdeel van het team en begrijp de workflow beter.', problems: 'Geen bijzondere problemen meer. Goede eerste week gehad.' },
    { name: 'Woensdag', date: '5 feb', status: 'Nog niet ingediend', tasks: '', reflection: '', problems: '' },
    { name: 'Donderdag', date: '6 feb', status: 'Nog niet ingediend', tasks: '', reflection: '', problems: '' },
    { name: 'Vrijdag', date: '7 feb', status: 'Nog niet ingediend', tasks: '', reflection: '', problems: '' },
  ];
  const afgevinkt = smIsWeekAfgevinkt(stagiair.email, weekNum);
  const comment = smGetWeekComment(stagiair.email, weekNum);

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('logboek')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div class="sm-detail-back-group">
            <a id="sm-back-stagiairs" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
            <a id="sm-back-week" class="sm-detail-back sm-detail-back--secondary" href="#">← Terug naar weekoverzicht</a>
            <h1 class="sm-detail-title">Week ${weekNum}</h1>
            <p class="sm-detail-subtitle">${escapeHtml(stagiair.start)} t/m ${escapeHtml(stagiair.einde)}</p>
          </div>
        </div>
        <div class="sm-week-day-list">
          ${days.map((d) => `
            <div class="sm-week-day-card">
              <div class="sm-week-day-header">
                <div>
                  <h3 class="sm-week-day-name">${d.name}</h3>
                  <p class="sm-week-day-date">${d.date}</p>
                </div>
                <span class="sm-status-pill ${d.status === 'Ingediend' ? 'sm-status--ok' : 'sm-status--pending'}">${d.status === 'Ingediend' ? '✓ Ingediend' : 'Nog niet ingediend'}</span>
              </div>
              <div class="sm-week-section">
                <h4 class="sm-week-section-title">Beschrijving van uitgevoerde taken</h4>
                <p class="sm-week-section-body">${escapeHtml(d.tasks || 'Geen activiteit geregistreerd.')}</p>
                <h4 class="sm-week-section-title" style="margin-top:16px;">Reflectie</h4>
                <p class="sm-week-section-body">${escapeHtml(d.reflection || 'Geen reflectie.')}</p>
                <h4 class="sm-week-section-title" style="margin-top:16px;">Problemen of leerpunten</h4>
                <p class="sm-week-section-body">${escapeHtml(d.problems || 'Geen opmerkingen.')}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sm-week-action-card">
          <h2>Week afvinken</h2>
          <p class="sm-week-action-text">Vink deze week af wanneer je alle logboeken hebt gecontroleerd en goedgekeurd.</p>
          <button id="sm-afvink" class="sm-button sm-button--success ${afgevinkt ? 'sm-afgevinkt' : ''}" ${afgevinkt ? 'disabled' : ''}>${afgevinkt ? 'Week Afgevinkt' : 'Week Afvinken'}</button>
          <p id="sm-afvink-message" class="${afgevinkt ? 'sm-afvink-message--success' : 'sm-afvink-message--idle'}">${afgevinkt ? 'Deze week is afgevinkt en opgeslagen.' : 'Klik op Week Afvinken om deze week te bevestigen.'}</p>
        </div>
        <div class="sm-week-comment-card">
          <label class="sm-week-comment-label" for="sm-comment">Opmerking bij Week ${weekNum}</label>
          <textarea id="sm-comment" class="sm-week-comment" placeholder="Schrijf hier je opmerkingen...">${escapeHtml(comment)}</textarea>
          <div style="margin-top:14px;">
            <button id="sm-save-comment" class="sm-button">Opmerking Opslaan</button>
          </div>
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back-week').addEventListener('click', (e) => { e.preventDefault(); renderLogboekOverview(app, stagiair); });
  document.querySelector('#sm-back-stagiairs').addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);

  document.querySelector('#sm-save-comment').addEventListener('click', () => {
    const val = document.querySelector('#sm-comment').value.trim();
    smSaveWeekComment(stagiair.email, weekNum, val);
    alert(val ? 'Opmerking opgeslagen.' : 'Opmerking verwijderd.');
  });

  const afvinkBtn = document.querySelector('#sm-afvink');
  if (afvinkBtn && !afgevinkt) {
    afvinkBtn.addEventListener('click', () => {
      smSetWeekAfgevinkt(stagiair.email, weekNum);
      afvinkBtn.textContent = 'Week Afgevinkt';
      afvinkBtn.disabled = true;
      afvinkBtn.classList.add('sm-afgevinkt');
      const m = document.querySelector('#sm-afvink-message');
      if (m) { m.textContent = 'Deze week is afgevinkt en opgeslagen.'; m.classList.remove('sm-afvink-message--idle'); m.classList.add('sm-afvink-message--success'); }
    });
  }
}

export function renderMijnStagiairs(app) {
  renderStagementorPage(app);
}
