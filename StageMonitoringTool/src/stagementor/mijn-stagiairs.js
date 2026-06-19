import './mijn-stagiairs.css';

let _userName = 'Stagementor';
let _currentUser = null;
let _allStagiairs = [];
let _logboekEntriesCache = [];

function formatDatumKort(d) {
  return d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
}

function formatDatumLang(d) {
  return d.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
}

function getWeekDates(startDate, endDate, weekIndex) {
  if (!startDate) return { start: '?', end: '?', days: 5, startDateObj: null, endDateObj: null };

  const weekStart = new Date(startDate);
  if (weekIndex === 0) {
      while (weekStart.getDay() === 0 || weekStart.getDay() === 6) {
          weekStart.setDate(weekStart.getDate() + 1);
      }
  } else {
      const startDay = startDate.getDay();
      const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
      weekStart.setDate(startDate.getDate() + daysToMonday + (weekIndex - 1) * 7);
  }

  const weekEnd = new Date(weekStart);
  if (weekIndex === 0) {
      weekEnd.setDate(weekEnd.getDate() + (5 - weekStart.getDay()));
  } else {
      weekEnd.setDate(weekEnd.getDate() + 4);
  }

  if (endDate && weekEnd > endDate) {
      weekEnd.setTime(endDate.getTime());
  }

  let count = 0;
  const temp = new Date(weekStart);
  while (temp <= weekEnd) {
      if (temp.getDay() !== 0 && temp.getDay() !== 6) count++;
      temp.setDate(temp.getDate() + 1);
  }

  return {
      start: formatDatumKort(weekStart),
      end: formatDatumKort(weekEnd),
      days: Math.max(1, count),
      startDateObj: new Date(weekStart),
      endDateObj: new Date(weekEnd)
  };
}

function mapApiStageToStagiair(s, logboekEntries = [], evalAvailable = false, mentorSubmitted = false, finaleEvalAvailable = false, finaleMentorSubmitted = false) {
  const start = s.stageDetails?.start;
  const einde = s.stageDetails?.einde;
  let totalWeeks = 0;
  if (start && einde) {
    totalWeeks = 1;
    const nextStart = new Date(start);
    nextStart.setHours(12, 0, 0, 0);
    const startDay = nextStart.getDay();
    const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
    nextStart.setDate(nextStart.getDate() + daysToMonday);
    const endObj = new Date(einde);
    endObj.setHours(12, 0, 0, 0);
    while (nextStart <= endObj) {
      totalWeeks++;
      nextStart.setDate(nextStart.getDate() + 7);
    }
  }

  let submittedWeeks = 0;
  if (start && einde && logboekEntries.length > 0) {
    const startDateObj = new Date(start);
    startDateObj.setHours(12, 0, 0, 0);
    const endDateObj = new Date(einde);
    endDateObj.setHours(12, 0, 0, 0);
    for (let i = 0; i < totalWeeks; i++) {
      const dates = getWeekDates(startDateObj, endDateObj, i);
      if (!dates.startDateObj) continue;
      const weekEntries = logboekEntries.filter(e => {
        if (!e.datum) return false;
        const entryDate = new Date(e.datum);
        entryDate.setHours(12, 0, 0, 0);
        return entryDate >= dates.startDateObj && entryDate <= dates.endDateObj;
      });
      if (weekEntries.length > 0 && weekEntries.every(e => e.status === 'INGEVULD' || e.status === 'DEELSINGEVULD')) {
        submittedWeeks++;
      }
    }
  }

  return {
    naam: s.naam || 'Onbekend',
    functie: s.stageDetails?.omschrijving?.slice(0, 40) || '–',
    email: s.studentEmail || '',
    bedrijf: s.bedrijf?.naam || '–',
    bedrijfFunctie: '–',
    start: start ? new Date(start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '–',
    einde: einde ? new Date(einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '–',
    totalWeeks,
    submittedWeeks,
    badges: [
      ...(evalAvailable && !mentorSubmitted ? [{ type: 'warning', label: 'Tussentijdse evaluatie beschikbaar' }] : []),
      ...(finaleEvalAvailable && !finaleMentorSubmitted ? [{ type: 'warning', label: 'Finale evaluatie beschikbaar' }] : []),
    ],
    stageData: s,
  };
}

// Lijst met competenties waarop de stagiair beoordeeld wordt.
// key wordt gebruikt om scores/feedback op te slaan.
// title en description worden op het scherm getoond.
const competenties = [
  { key: 'planningsproces', title: 'Beheersing van het planningsproces', description: 'De student kan zelfstandig een planning opstellen en opvolgen.' },
  { key: 'it-oplossingen', title: 'Ontwerpen IT-oplossingen', description: 'De student kan IT-oplossingen ontwerpen op basis van een probleemanalyse.' },
  { key: 'digitale-producten', title: 'Implementatie digitale producten', description: 'De student kan digitale producten bouwen en implementeren.' },
  { key: 'communicatie', title: 'Helder en transparant communiceren', description: 'De student communiceert professioneel met stakeholders.' },
  { key: 'persoonlijke-ontwikkeling', title: 'Persoonlijke ontwikkeling', description: 'De student werkt actief aan zijn persoonlijke en professionele groei.' },
];

// storage helpers
// Deze functies bewaren en lezen gegevens in localStorage.
// localStorage is opslag in de browser, dus de gegevens blijven bewaard na refresh.

// Controleert of een week al afgevinkt is.
function smIsWeekAfgevinkt(email, week) { try { return localStorage.getItem(`sm_afgevinkt_${email}_${week}`) === '1'; } catch { return false; } }

// Slaat op dat een week afgevinkt is.
function smSetWeekAfgevinkt(email, week) { try { localStorage.setItem(`sm_afgevinkt_${email}_${week}`, '1'); } catch {} }


// Haalt een opgeslagen evaluatiescore op.
function smGetEvaluationScore(email, type, c) { try { return localStorage.getItem(`sm_eval_score_${email}_${type}_${c}`) || ''; } catch { return ''; } }

// Slaat een evaluatiescore op.
function smSaveEvaluationScore(email, type, c, s) { try { localStorage.setItem(`sm_eval_score_${email}_${type}_${c}`, String(s)); } catch {} }

// Haalt opgeslagen feedback op.
function smGetEvaluationFeedback(email, type, c) { try { return localStorage.getItem(`sm_eval_feedback_${email}_${type}_${c}`) || ''; } catch { return ''; } }

// Slaat feedback op.
function smSaveEvaluationFeedback(email, type, c, t) { try { localStorage.setItem(`sm_eval_feedback_${email}_${type}_${c}`, t); } catch {} }

// API helpers for evaluatie (backed by database, not localStorage)
let _competentiesCache = null;

async function fetchEvaluatieStatus(stageId, type_evaluatie) {
  const res = await fetch(
    `/api/evaluaties/status?stage_id=${encodeURIComponent(stageId)}&type_evaluatie=${encodeURIComponent(type_evaluatie)}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error(`Failed to fetch evaluatie status: ${res.status}`);
  return res.json();
}

async function registreerEvaluatie(stageId, type_evaluatie) {
  const res = await fetch('/api/evaluaties/create-per-competentie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ stage_id: stageId, type_evaluatie }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to register evaluaties: ${res.status} ${text}`);
  }
  return res.json();
}

async function fetchCompetentiesMetRubrieken() {
  if (_competentiesCache) return _competentiesCache;
  const res = await fetch('/api/competenties/all-met-rubrieken', { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch competenties: ${res.status}`);
  const json = await res.json();
  _competentiesCache = json.data;
  return _competentiesCache;
}

// Maakt tekst veilig voordat ze in HTML geplaatst wordt.
// Dit voorkomt problemen met speciale tekens zoals <, >, " en '.
function escapeHtml(s) {
  return String(s).replace(/[&<<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Bouwt de zijbalk van de detailpagina's.
// activePage bepaalt welk menu-item de class "active" krijgt.
function sidebarHtml(activePage) {
  const items = [
    { key: 'overzicht', label: 'Overzicht' },
    { key: 'stagedetails', label: 'Stagedetails' },
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

// Maakt een badge aan voor waarschuwingen.
// Bijvoorbeeld: geel voor warning en rood voor danger.
function renderBadge(b) {
  const cls = b.type === 'danger' ? 'sm-badge--danger' : 'sm-badge--warning';
  return `<span class="sm-badge ${cls}">${escapeHtml(b.label)}</span>`;
}

// Maakt de HTML voor 1 stagiairkaart.
// s is de stagiair, index is de positie in de stagiairs-array.
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

// Toont de startpagina met alle stagiairs.
// app is het element waarin de volledige pagina wordt geplaatst.
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
          <span class="sm-user-name">${_userName}</span>
          <a class="sm-logout" href="#">Uitloggen</a>
        </div>
      </aside>
      <main class="sm-main">
        <header class="sm-main-header">
          <h1 class="sm-main-title">Mijn Stagiairs</h1>
          <p class="sm-welcome">Welkom, ${_userName}</p>
        </header>
        <section class="sm-content">
          <div class="sm-stagiair-list">
            ${_allStagiairs.length > 0
              ? _allStagiairs.map(renderStagiairKaart).join('')
              : '<p style="color:#6b7280;padding:16px;">Geen stagiairs gevonden.</p>'}
          </div>
        </section>
      </main>
    </div>
  `;

  document.querySelectorAll('.sm-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      renderStudentDetail(app, _allStagiairs[idx]);
    });
  });
}

// Koppelt de zijbalknavigatie aan de juiste pagina's.
// Elke klik toont een ander onderdeel van dezelfde stagiair.
function attachNav(app, stagiair) {
  document.querySelectorAll('.sm-nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      if (page === 'overzicht') {
        renderStudentDetail(app, stagiair);

      } else if (page === 'stagedetails') {
        renderStageDetailsPage(app, stagiair);

      } else if (page === 'documenten') {
        renderDocumentenPage(app, stagiair);

      } else if (page === 'logboek') {
        renderLogboekOverview(app, stagiair);

      } else if (page === 'evaluatie') {
        renderEvaluatiePage(app, stagiair, 'tussentijds');
      }
    });
  });
}




function renderStageDetailsPage(app, stagiair) {
  const sd = stagiair.stageData || {};
  const bedrijfNaam = sd.bedrijf?.naam || stagiair.bedrijf || '–';
  const bedrijfAdres = sd.bedrijf?.adres || '–';
  const mentorNaam = sd.stagementor?.naam || '–';
  const docentNaam = sd.docent?.naam || 'Niet toegewezen';
  const omschrijving = sd.stageDetails?.omschrijving || 'Geen omschrijving beschikbaar';
  const startDatum = sd.stageDetails?.start
    ? new Date(sd.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' })
    : stagiair.start || '–';
  const eindDatum = sd.stageDetails?.einde
    ? new Date(sd.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' })
    : stagiair.einde || '–';
  const rawStatus = sd.rawStatus || '';
  const statusLabel = rawStatus === 'GOEDGEKEURD' ? 'Goedgekeurd'
    : rawStatus === 'AANVRAAG' ? 'In afwachting'
    : rawStatus === 'AFGEKEURD' ? 'Afgekeurd'
    : rawStatus || 'Onbekend';

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('stagedetails')}

      <main class="sm-main sm-main--detail">
        <div class="sm-topbar">
          <a href="#" id="sm-back-stagedetails" class="sm-detail-back">
            ← Terug naar stagiairs
          </a>
        </div>
        <h1 class="sm-detail-title">Stagedetails</h1>
        <span class="sm-stage-status">${statusLabel}</span>

        <div class="sm-stage-card">
          <div class="sm-stage-section">
            <h3>Student</h3>
            <p>${escapeHtml(stagiair.naam)}</p>
            <span>${escapeHtml(stagiair.email)}</span>
          </div>
          <div class="sm-stage-section">
            <h3>Bedrijf</h3>
            <p>${escapeHtml(bedrijfNaam)}</p>
            <span>${escapeHtml(bedrijfAdres)}</span>
          </div>
          <div class="sm-stage-section">
            <h3>Stagementor</h3>
            <p>${escapeHtml(mentorNaam)}</p>
          </div>
          <div class="sm-stage-section">
            <h3>EhB-docent</h3>
            <p>${escapeHtml(docentNaam)}</p>
          </div>
          <div class="sm-stage-section">
            <h3>Periode</h3>
            <p>${escapeHtml(startDatum)} t/m ${escapeHtml(eindDatum)}</p>
          </div>
          <div class="sm-stage-section">
            <h3>Omschrijving van de opdracht</h3>
            <p>${escapeHtml(omschrijving)}</p>
          </div>
        </div>
      </main>
    </div>
  `;

  // Deze klikactie zorgt dat de terugknop opnieuw het studentdetail opent.
  document
    .querySelector('#sm-back-stagedetails')
    .addEventListener('click', (e) => {
      e.preventDefault();
      renderStudentDetail(app, stagiair);
    });

  attachNav(app, stagiair);
}


// Toont het detailoverzicht van 1 stagiair.
// Dit is de pagina na het klikken op "Student Bekijken".
function renderStudentDetail(app, stagiair) {
  // Berekent hoeveel procent van de stageweken al is ingediend.
  const progressPct = stagiair.totalWeeks > 0 ? Math.round((stagiair.submittedWeeks / stagiair.totalWeeks) * 100) : 0;
  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('overzicht')}
      <main class="sm-main sm-main--detail">
        <div class="sm-topbar">
          <a id="sm-back" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
        </div>
        <h1 class="sm-detail-title">Stagiair: ${escapeHtml(stagiair.naam)}</h1>
        <p class="sm-detail-email">${escapeHtml(stagiair.email)}</p>
        <div class="sm-detail-grid">
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Stage Periode</p>
            <p class="sm-detail-card-value">${escapeHtml(stagiair.start)} - ${escapeHtml(stagiair.einde)}</p>
            <p class="sm-detail-card-meta">${stagiair.totalWeeks} weken totaal</p>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Logboek Status</p>
            <p class="sm-detail-card-value">${stagiair.submittedWeeks} / ${stagiair.totalWeeks} weken</p>
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

  // Terug naar het overzicht met alle stagiairs (herlaad data zodat badges kloppen).
  document.querySelector('#sm-back').addEventListener('click', (e) => { e.preventDefault(); renderMijnStagiairs(app, _currentUser); });

  // Activeert de links in de zijbalk.
  attachNav(app, stagiair);

  // Zorgt dat de actiekaarten klikbaar zijn.
  // data-action bepaalt welke pagina geopend wordt.
  document.querySelectorAll('.sm-action-card').forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      if (action === 'logboek') renderLogboekOverview(app, stagiair);
      else if (action === 'evaluaties') renderEvaluatiePage(app, stagiair, 'tussentijds');
    });
  });
}

// Toont de evaluatiepagina.
// activeTab is standaard "tussentijds", maar kan ook "finale" zijn.
async function renderEvaluatiePage(app, stagiair, activeTab = 'tussentijds') {
  const stageId = stagiair.stageData?.id;
  if (!stageId) { renderStudentDetail(app, stagiair); return; }
  app.innerHTML = `<div class="sm-layout">${sidebarHtml('evaluatie')}<main class="sm-main sm-main--detail"><p style="padding:24px;color:#6b7280;">Evaluatie laden...</p></main></div>`;
  try {
    const status = await fetchEvaluatieStatus(stageId, activeTab);
    if (!status.bestaat) { renderEvaluatieRegistreerScreen(app, stagiair, activeTab); }
    else { await renderEvaluatieScoreScreen(app, stagiair, activeTab, status.evaluaties); }
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="sm-layout">${sidebarHtml('evaluatie')}<main class="sm-main sm-main--detail"><div class="sm-topbar"><a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a></div><h1 class="sm-detail-title">Evaluatie</h1><p class="sm-detail-subtitle">Fout bij het laden</p><div class="sm-eval-block"><div class="sm-eval-block-header"><h3>Verbinding mislukt</h3><p>Kan de evaluatie-informatie niet ophalen.</p></div><div class="sm-eval-actions"><button id="sm-eval-retry" class="sm-button">Opnieuw proberen</button></div></div></main></div>`;
    document.querySelector('#sm-back-evaluatie')?.addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
    document.querySelector('#sm-eval-retry')?.addEventListener('click', () => renderEvaluatiePage(app, stagiair, activeTab));
  }
}

function renderEvaluatieRegistreerScreen(app, stagiair, activeTab) {
  const isFinale = activeTab === 'finale';
  const titel = isFinale ? 'Finale evaluatie' : 'Tussentijdse evaluatie';
  app.innerHTML = `<div class="sm-layout">${sidebarHtml('evaluatie')}<main class="sm-main sm-main--detail"><div class="sm-topbar"><a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a></div><h1 class="sm-detail-title">Evaluatie</h1><p class="sm-detail-subtitle">Evalueer de stagiair als mentor</p><div class="sm-eval-tabs"><button class="sm-eval-tab ${activeTab === 'tussentijds' ? 'active' : ''}" data-tab="tussentijds">Tussentijdse evaluatie</button><button class="sm-eval-tab ${activeTab === 'finale' ? 'active' : ''}" data-tab="finale">Finale evaluatie</button></div><div class="sm-eval-block"><div class="sm-eval-block-header"><h3>${titel}</h3><p>Wacht tot de docent de evaluatie aanmaakt. Zodra de evaluatie beschikbaar is, kun je hier je mentor-score en feedback invullen.</p></div></div></main></div>`;
  document.querySelector('#sm-back-evaluatie')?.addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);
  document.querySelectorAll('.sm-eval-tab').forEach((tab) => { tab.addEventListener('click', () => renderEvaluatiePage(app, stagiair, tab.dataset.tab)); });
}

async function renderEvaluatieScoreScreen(app, stagiair, activeTab, evaluatieData = []) {
  const scores = [1, 2, 3, 4, 5];
  const competenties = await fetchCompetentiesMetRubrieken();
  const dataByCode = Object.fromEntries(evaluatieData.map((e) => [e.competentie_code, e]));
  const blockTitle = activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking';
  const initTotal = (() => { const ids = Array.from(new Set(evaluatieData.map(e => e?.competentie_id).filter(Boolean))); const N = ids.length; if (!N) return null; return Math.round((evaluatieData.reduce((a, e) => { const s = e?.score_mentor; return s == null ? a : a + (Number(s) / 5) * 20; }, 0) / N) * 10) / 10; })();

  app.innerHTML = `<div class="sm-layout">${sidebarHtml('evaluatie')}<main class="sm-main sm-main--detail"><div class="sm-topbar"><a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a></div><h1 class="sm-detail-title">Evaluatie</h1><p class="sm-detail-subtitle">Evalueer de stagiair als mentor</p><div class="sm-eval-tabs"><button class="sm-eval-tab ${activeTab === 'tussentijds' ? 'active' : ''}" data-tab="tussentijds">Tussentijdse evaluatie</button><button class="sm-eval-tab ${activeTab === 'finale' ? 'active' : ''}" data-tab="finale">Finale evaluatie</button></div><div class="sm-eval-block"><div class="sm-eval-block-header"><h3>${blockTitle}</h3><p>Geef per competentie een score en feedback.</p><p style="margin-top:6px;color:#6b7280;">Datum: <strong>${new Date().toLocaleDateString('nl-BE')}</strong></p></div><div id="sm-eval-result-column" style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#fff;margin-bottom:20px;"><div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Uitkomst</div><div style="font-size:30px;font-weight:800;color:#111827;">${initTotal != null ? initTotal.toFixed(1) + '/20' : '--'}</div><div style="font-size:13px;color:#6b7280;margin-top:6px;">Gebaseerd op je mentor-scores</div></div>${competenties.map((comp) => { const b = dataByCode[comp.code]; const rubriekMap = Object.fromEntries((comp.Rubrieks || []).map(r => [r.score, escapeHtml(r.beschrijving)])); return `<div class="sm-eval-competentie" data-competentie-id="${comp.competentie_id}" data-competentie-code="${comp.code}"><h3 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">${escapeHtml(comp.titel)}</h3><p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(comp.omschrijving)}</p><div><span class="sm-score-title">Hoe scoor je deze competentie? Klik op een score (1 = laag, 5 = hoog)</span><div class="sm-eval-score-cards">${scores.map((sc) => `<button type="button" class="sm-score-card sm-score-card--${sc} ${b?.score_mentor === sc ? 'selected' : ''}" data-score="${sc}" data-competentie="${comp.competentie_id}" data-competentie-code="${comp.code}"><span class="sm-score-card-number">${sc}</span><span class="sm-score-card-text">${rubriekMap[sc] || ''}</span></button>`).join('')}</div></div><div class="sm-eval-mentor-panel"><h4>Feedback (mentor)</h4><label class="sm-eval-feedback-label" for="feedback-${comp.competentie_id}">Feedback</label><textarea id="feedback-${comp.competentie_id}" class="sm-eval-feedback" placeholder="Beschrijf je feedback...">${escapeHtml(b?.feedback_mentor ?? '')}</textarea></div></div>`; }).join('')}<div class="sm-eval-actions"><button id="sm-eval-save" class="sm-button">Beoordeling Opslaan</button><button id="sm-eval-submit" class="sm-button" style="margin-left:10px;">Indienen</button></div><p id="sm-eval-save-message" class="sm-eval-save-message hidden"></p></div></main></div>`;

  document.querySelector('#sm-back-evaluatie')?.addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);
  document.querySelectorAll('.sm-eval-tab').forEach((tab) => { tab.addEventListener('click', () => renderEvaluatiePage(app, stagiair, tab.dataset.tab)); });
  document.querySelectorAll('.sm-score-card').forEach((card) => { card.addEventListener('click', () => { const c = card.closest('.sm-eval-score-cards'); if (!c) return; c.querySelectorAll('.sm-score-card').forEach((b) => b.classList.remove('selected')); card.classList.add('selected'); const comp = card.closest('.sm-eval-competentie'); if (comp) comp.classList.remove('sm-eval-competentie--error'); const msg = document.querySelector('#sm-eval-save-message'); if (msg) msg.classList.remove('sm-eval-save-message--error'); }); });

  // Grey out if already submitted (check backend flag from evaluatieData)
  if (evaluatieData.length > 0 && evaluatieData.every((e) => e.ingediend_mentor)) {
    document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
    document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
    const saveBtn = document.querySelector('#sm-eval-save');
    const submitBtn = document.querySelector('#sm-eval-submit');
    if (saveBtn) saveBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    const msg = document.querySelector('#sm-eval-save-message');
    if (msg) {
      msg.textContent = 'Je evaluatie is reeds ingediend en kan niet meer worden gewijzigd.';
      msg.classList.remove('hidden');
    }
  }

  async function saveMentorEvaluatie(isSubmit = false) {
    const saveBtn = document.querySelector('#sm-eval-save');
    const submitBtn = document.querySelector('#sm-eval-submit');

    if (isSubmit) {
      let allFilled = true;
      document.querySelectorAll('.sm-eval-competentie').forEach((el) => {
        const hasScore = el.querySelector('.sm-score-card.selected');
        if (!hasScore) { el.classList.add('sm-eval-competentie--error'); allFilled = false; }
      });
      if (!allFilled) {
        const msg = document.querySelector('#sm-eval-save-message');
        if (msg) { msg.textContent = 'Vul alle competenties in voordat je kunt indienen.'; msg.classList.remove('hidden'); msg.classList.add('sm-eval-save-message--error'); }
        saveBtn && (saveBtn.disabled = false); submitBtn && (submitBtn.disabled = false);
        return;
      }
    }

    saveBtn && (saveBtn.disabled = true); submitBtn && (submitBtn.disabled = true);
    const stageId = stagiair.stageData?.id;
    const updates = Array.from(document.querySelectorAll('.sm-eval-competentie')).map((el) => {
      const code = el.dataset.competentieCode;
      const sel = el.querySelector('.sm-score-card.selected');
      const fb = el.querySelector('.sm-eval-feedback')?.value ?? '';
      return { competentie_code: code, score: null, feedback: null, score_mentor: sel ? Number(sel.dataset.score) : null, feedback_mentor: fb || null };
    });
    try {
      const res = await fetch(`/api/evaluaties/${stageId}/per-competentie`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ stage_id: stageId, type_evaluatie: activeTab, updates, ingediend_role: isSubmit ? 'mentor' : undefined }) });
      if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error(`Save failed: ${res.status} ${t}`); }
      const json = await res.json().catch(() => ({}));
      const rc = document.querySelector('#sm-eval-result-column');
      if (rc) { const v = rc.querySelector('div[style*="font-size:30px"]'); if (v) v.textContent = (json?.totalPercentage != null && !Number.isNaN(Number(json.totalPercentage))) ? (Number(json.totalPercentage) / 5).toFixed(1) + '/20' : '--'; }
      const msg = document.querySelector('#sm-eval-save-message');
      if (isSubmit) {
        if (msg) { msg.textContent = 'Evaluatie succesvol ingediend.'; msg.classList.remove('hidden'); }
        document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
        document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
        if (submitBtn) submitBtn.disabled = true;
        if (saveBtn) saveBtn.disabled = true;
        setTimeout(() => { renderStudentDetail(app, stagiair); }, 1500);
      }
      else { if (msg) { msg.textContent = 'Evaluatie opgeslagen.'; msg.classList.remove('hidden'); } }
    } catch (e) { console.error(e); const msg = document.querySelector('#sm-eval-save-message'); if (msg) { msg.textContent = isSubmit ? 'Indienen mislukt.' : 'Opslaan mislukt.'; msg.classList.remove('hidden'); } }
    finally { if (!isSubmit) { saveBtn && (saveBtn.disabled = false); submitBtn && (submitBtn.disabled = false); } }
  }
  document.querySelector('#sm-eval-save')?.addEventListener('click', () => saveMentorEvaluatie(false));
  document.querySelector('#sm-eval-submit')?.addEventListener('click', () => saveMentorEvaluatie(true));
}

// Toont het overzicht van alle logboekweken.
async function renderLogboekOverview(app, stagiair) {
  const sd = stagiair.stageData || {};
  const startDate = sd.stageDetails?.start ? new Date(sd.stageDetails.start) : null;
  if (startDate) startDate.setHours(12, 0, 0, 0);
  const endDate = sd.stageDetails?.einde ? new Date(sd.stageDetails.einde) : null;
  if (endDate) endDate.setHours(12, 0, 0, 0);

  let logboekEntries = [];
  if (sd.id) {
    try {
      const res = await fetch(`/api/logboek/stage/${sd.id}`, { credentials: 'include' });
      logboekEntries = await res.json();
      if (!Array.isArray(logboekEntries)) logboekEntries = [];
    } catch (err) {
      console.error('Error fetching logboek:', err);
    }
  }
  _logboekEntriesCache = logboekEntries;

  let totalWeeks = stagiair.totalWeeks;
  if (!totalWeeks) {
    if (startDate && endDate) {
      totalWeeks = 1;
      const nextStart = new Date(startDate);
      const startDay = nextStart.getDay();
      const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
      nextStart.setDate(nextStart.getDate() + daysToMonday);
      while (nextStart <= endDate) {
        totalWeeks++;
        nextStart.setDate(nextStart.getDate() + 7);
      }
    } else {
      totalWeeks = 16;
    }
  }

  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNum = i + 1;
    const dates = getWeekDates(startDate, endDate, i);
    let daysFilled = 0;
    let allIngevuld = false;
    let allGevinkt = false;
    let hasEntries = false;

    if (dates.startDateObj) {
      const weekEntries = logboekEntries.filter(e => {
        if (!e.datum) return false;
        const entryDate = new Date(e.datum);
        entryDate.setHours(12, 0, 0, 0);
        return entryDate >= dates.startDateObj && entryDate <= dates.endDateObj;
      });
      hasEntries = weekEntries.length > 0;
      const filledEntries = weekEntries.filter(e => e.status === 'DEELSINGEVULD' || e.status === 'INGEVULD');
      daysFilled = filledEntries.length;
      allIngevuld = weekEntries.length > 0 && weekEntries.every(e => e.status === 'INGEVULD');
      allGevinkt = allIngevuld && weekEntries.every(e => e.gevinkt_door_stagementor);
    }

    let status = 'not_submitted';
    if (allGevinkt) status = 'afgevinkt_door_stagementor';
    else if (allIngevuld) status = 'submitted';
    else if (hasEntries) status = 'in_progress';

    return { weekNum, dateRange: `${dates.start} t/m ${dates.end}`, filled: daysFilled, total: dates.days, status, allGevinkt };
  });

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('logboek')}
      <main class="sm-main sm-main--detail">
        <div class="sm-topbar">
          <a id="sm-back-logboek" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
        </div>
        <h1 class="sm-detail-title">Logboek - Weekoverzicht</h1>
        <p class="sm-detail-subtitle">Bekijk en controleer de wekelijkse logboeken van ${escapeHtml(stagiair.naam)}</p>
        <div class="sm-logboek-list">
          ${weeks.map((w) => {
            const pct = w.total > 0 ? (w.filled / w.total) * 100 : 0;
            let statusClass = 'sm-status--pending';
            let statusText = 'Nog niet ingediend';
            if (w.status === 'afgevinkt_door_stagementor') {
              statusClass = 'sm-status--ok';
              statusText = 'Afgevinkt door stagementor';
            } else if (w.status === 'submitted') {
              statusClass = 'sm-status--ok';
              statusText = 'Ingediend';
            } else if (w.status === 'in_progress') {
              statusText = 'Bezig';
            }
            return `
              <div class="sm-week-card" data-week="${w.weekNum}">
                <div class="sm-week-left">
                  <h3>Week ${w.weekNum}</h3>
                  <p class="sm-week-dates">${w.dateRange}</p>
                </div>
                <div class="sm-week-right">
                  <span class="sm-week-progress-text">${w.filled}/${w.total} dagen ingevuld</span>
                  <div class="sm-week-progress"><div class="sm-week-progress-bar" style="width:${pct}%"></div></div>
                  <span class="sm-status-badge ${statusClass}">${statusText}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </main>
    </div>
  `;

  // Terug naar het detailoverzicht van de stagiair.
  document.querySelector('#sm-back-logboek').addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);

  // Elke weekkaart opent de detailpagina van die specifieke week.
  document.querySelectorAll('.sm-week-card').forEach((card) => {
    card.addEventListener('click', () => renderWeekDetail(app, stagiair, Number(card.dataset.week)));
  });
}

// Toont de details van 1 logboekweek.
// weekNum bepaalt welke week je bekijkt.
async function renderWeekDetail(app, stagiair, weekNum) {
  const sd = stagiair.stageData || {};
  const startDate = sd.stageDetails?.start ? new Date(sd.stageDetails.start) : null;
  if (startDate) startDate.setHours(12, 0, 0, 0);
  const endDate = sd.stageDetails?.einde ? new Date(sd.stageDetails.einde) : null;
  if (endDate) endDate.setHours(12, 0, 0, 0);

  let logboekEntries = [];
  if (sd.id) {
    try {
      const res = await fetch(`/api/logboek/stage/${sd.id}`, { credentials: 'include' });
      logboekEntries = await res.json();
      if (!Array.isArray(logboekEntries)) logboekEntries = [];
    } catch (err) {
      console.error('Error fetching logboek:', err);
    }
  }
  _logboekEntriesCache = logboekEntries;

  const weekIndex = weekNum - 1;
  const days = [];
  const weekDates = getWeekDates(startDate, endDate, weekIndex);

  if (weekDates.startDateObj) {
    const dag = new Date(weekDates.startDateObj);
    while (dag <= weekDates.endDateObj) {
      if (dag.getDay() !== 0 && dag.getDay() !== 6) {
        const dateStr = dag.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
        const nameRaw = dag.toLocaleDateString('nl-BE', { weekday: 'long' });
        const nameCapitalized = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);

        const y = dag.getFullYear();
        const m = String(dag.getMonth() + 1).padStart(2, '0');
        const d_str = String(dag.getDate()).padStart(2, '0');
        const dateKey = `${y}-${m}-${d_str}`;
        const entry = logboekEntries.find(e => {
          if (!e.datum) return false;
          const ed = new Date(e.datum);
          const ey = ed.getFullYear();
          const em = String(ed.getMonth() + 1).padStart(2, '0');
          const eday = String(ed.getDate()).padStart(2, '0');
          return `${ey}-${em}-${eday}` === dateKey;
        });

        const isGevinkt = entry && entry.gevinkt_door_stagementor;
        const isIngevuld = entry && (entry.status === 'INGEVULD' || entry.status === 'DEELSINGEVULD');
        let status = 'Nog niet ingediend';
        if (isGevinkt) status = 'Afgevinkt door stagementor';
        else if (isIngevuld) status = 'Ingediend';

        days.push({
          name: nameCapitalized,
          date: dateStr,
          status,
          tasks: entry ? entry.uitgevoerdeTaken || '' : '',
          reflection: entry ? entry.reflectie || '' : '',
          problems: entry ? entry.leerpunten || '' : ''
        });
      }
      dag.setDate(dag.getDate() + 1);
    }
  }

  const afgevinkt = days.length > 0 && days.every(d => d.status === 'Afgevinkt door stagementor');
  const allDaysIngevuld = days.length > 0 && days.every(d => d.status === 'Ingediend' || d.status === 'Afgevinkt door stagementor');

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('logboek')}
      <main class="sm-main sm-main--detail">
        <div class="sm-topbar">
          <a id="sm-back-stagiairs" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
          <a id="sm-back-week" class="sm-detail-back" href="#" style="margin-left:12px;">← Terug naar weekoverzicht</a>
        </div>
        <h1 class="sm-detail-title">Week ${weekNum}</h1>
        <p class="sm-detail-subtitle">${escapeHtml(stagiair.start)} t/m ${escapeHtml(stagiair.einde)}</p>
        <div class="sm-week-day-list">
          ${days.map((d) => `
            <div class="sm-week-day-card">
              <div class="sm-week-day-header">
                <div>
                  <h3 class="sm-week-day-name">${d.name}</h3>
                  <p class="sm-week-day-date">${d.date}</p>
                </div>
                <span class="sm-status-pill ${d.status === 'Ingediend' || d.status === 'Afgevinkt door stagementor' ? 'sm-status--ok' : 'sm-status--pending'}">${d.status === 'Ingediend' ? '✓ Ingediend' : d.status === 'Afgevinkt door stagementor' ? '✓ Afgevinkt' : 'Nog niet ingediend'}</span>
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
        ${allDaysIngevuld ? `
        <div class="sm-week-action-card">
          <h2>Week afvinken</h2>
          <p class="sm-week-action-text">Vink deze week af wanneer je alle logboeken hebt gecontroleerd en goedgekeurd.</p>
          <button id="sm-afvink" class="sm-button sm-button--success ${afgevinkt ? 'sm-afgevinkt' : ''}" ${afgevinkt ? 'disabled' : ''}>${afgevinkt ? 'Week Afgevinkt' : 'Week Afvinken'}</button>
          <p id="sm-afvink-message" class="${afgevinkt ? 'sm-afvink-message--success' : 'sm-afvink-message--idle'}">${afgevinkt ? 'Deze week is afgevinkt en opgeslagen.' : 'Klik op Week Afvinken om deze week te bevestigen.'}</p>
        </div>
        ` : ''}
      </main>
    </div>
  `;

  // Terug naar het weekoverzicht.
  document.querySelector('#sm-back-week').addEventListener('click', (e) => { e.preventDefault(); renderLogboekOverview(app, stagiair); });

  // Terug naar het detailoverzicht van de stagiair.
  document.querySelector('#sm-back-stagiairs').addEventListener('click', (e) => { e.preventDefault(); renderStudentDetail(app, stagiair); });
  attachNav(app, stagiair);

  // Zoekt de knop waarmee de mentor de week kan afvinken.
  const afvinkBtn = document.querySelector('#sm-afvink');

  // Alleen als de week nog niet afgevinkt is, krijgt de knop een klikactie.
  if (afvinkBtn && !afgevinkt) {
    afvinkBtn.addEventListener('click', async () => {
      const confirmed = confirm('Weet je zeker dat je deze week wilt afvinken?');
      if (!confirmed) return;

      afvinkBtn.disabled = true;
      afvinkBtn.textContent = 'Bezig...';

      try {
        const sd = stagiair.stageData || {};
        const startDateObj = sd.stageDetails?.start ? new Date(sd.stageDetails.start) : null;
        const endDateObj = sd.stageDetails?.einde ? new Date(sd.stageDetails.einde) : null;

        function toDateString(d) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        const weekIdx = weekNum - 1;
        const weekDates = getWeekDates(startDateObj, endDateObj, weekIdx);
        const firstDay = weekDates.startDateObj;
        const lastDay = weekDates.endDateObj;
        if (!firstDay || !lastDay || !sd.id) {
          afvinkBtn.disabled = false;
          afvinkBtn.textContent = 'Week Afvinken';
          return;
        }

        const res = await fetch('/api/logboek/afvink-week-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            stage_id: sd.id,
            weekStart: toDateString(firstDay),
            weekEnd: toDateString(lastDay)
          })
        });

        if (res.ok) {
          smSetWeekAfgevinkt(stagiair.email, weekNum);
          // Re-fetch logboek entries so the cache has updated gevinkt_door_stagementor values
          if (sd.id) {
            try {
              const refreshed = await fetch(`/api/logboek/stage/${sd.id}`, { credentials: 'include' });
              const refreshedData = await refreshed.json();
              if (Array.isArray(refreshedData)) _logboekEntriesCache = refreshedData;
            } catch (_) {}
          }
          // Refresh the cache then go back to week overview
          renderLogboekOverview(app, stagiair);
        } else {
          const err = await res.json();
          afvinkBtn.disabled = false;
          afvinkBtn.textContent = 'Week Afvinken';
          alert(err.msg || 'Fout bij afvinken.');
        }
      } catch (err) {
        console.error('Error afvinken week:', err);
        afvinkBtn.disabled = false;
        afvinkBtn.textContent = 'Week Afvinken';
        alert('Server fout bij afvinken.');
      }
    });
  }
}
// Toont de documentenpagina.
// Op dit moment staat hier vooral de stageovereenkomst.
function renderDocumentenPage(app, stagiair) {
  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('documenten')}

      <main class="sm-main sm-main--detail">
        <div class="sm-topbar">
          <a href="#" id="sm-back-documenten" class="sm-detail-back">
            ← Terug naar stagiairs
          </a>
        </div>
        <h1 class="sm-detail-title">Documenten</h1>

        <div class="sm-document-card">
          <div class="sm-document-header">
            <div>
              <h2 class="sm-document-title">Stageovereenkomst</h2>
              <p class="sm-document-subtitle">
                Officieel document tussen student, bedrijf en school
              </p>
            </div>

            <span class="sm-document-status">
              Ondertekend
            </span>
          </div>

          <div class="sm-document-divider"></div>

          <p class="sm-document-text">
            De stageovereenkomst is opgesteld en ondertekend door alle partijen.
          </p>

          <button class="sm-button">
            Download Overeenkomst
          </button>
        </div>
      </main>
    </div>
  `;

  // Terug naar het detailoverzicht van de stagiair.
  document
    .querySelector('#sm-back-documenten')
    .addEventListener('click', (e) => {
      e.preventDefault();
      renderStudentDetail(app, stagiair);
    });

  attachNav(app, stagiair);
}



export async function renderMijnStagiairs(app, user) {
  if (user) _currentUser = user;
  _userName = _currentUser
    ? (_currentUser.last_name ? `${_currentUser.last_name.toUpperCase()} ${_currentUser.first_name}` : _currentUser.first_name || 'Stagementor')
    : 'Stagementor';

  if (_currentUser && _currentUser.user_id) {
    try {
      const res = await fetch(`/api/stages/stagementor/${_currentUser.user_id}`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        const stagiairsWithLogboek = await Promise.all(data.map(async (s) => {
          let logboekEntries = [];
          let evalAvailable = false;
          let mentorSubmitted = false;
          let finaleEvalAvailable = false;
          let finaleMentorSubmitted = false;
          if (s.id) {
            try {
              const logRes = await fetch(`/api/logboek/stage/${s.id}`, { credentials: 'include' });
              logboekEntries = await logRes.json();
              if (!Array.isArray(logboekEntries)) logboekEntries = [];
            } catch (_) {}
            try {
              const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${s.id}`, { credentials: 'include' });
              const evalData = await evalRes.json();
              evalAvailable = evalData.bestaatDoorDocent === true;
            } catch (_) {}
            if (evalAvailable) {
              try {
                const statusRes = await fetch(`/api/evaluaties/status?stage_id=${s.id}&type_evaluatie=tussentijds`, { credentials: 'include' });
                const statusData = await statusRes.json();
                mentorSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                  && statusData.evaluaties.every((e) => e.ingediend_mentor);
              } catch (_) {}
            }
            try {
              const finaleStatusRes = await fetch(`/api/evaluaties/status?stage_id=${s.id}&type_evaluatie=finale`, { credentials: 'include' });
              const finaleStatusData = await finaleStatusRes.json();
              finaleEvalAvailable = finaleStatusData.bestaat === true
                && finaleStatusData.evaluaties && finaleStatusData.evaluaties.length > 0
                && finaleStatusData.evaluaties.some((e) => e.docent_id != null && (e.score != null || e.feedback_docent != null));
              if (finaleEvalAvailable) {
                finaleMentorSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_mentor);
              }
            } catch (_) {}
          }
          return mapApiStageToStagiair(s, logboekEntries, evalAvailable, mentorSubmitted, finaleEvalAvailable, finaleMentorSubmitted);
        }));
        _allStagiairs = stagiairsWithLogboek;
      }
    } catch (err) {
      console.error('Fout bij ophalen stagiairs:', err);
    }
  }

  renderStagementorPage(app);
}
