import './mijn-studenten.css';

let testDateOverride = null;
let lastApp = null;
let lastUser = null;

function getNow() {
  return testDateOverride || new Date();
}

function berekenVoortgang(startDatum, eindDatum) {
  if (!startDatum || !eindDatum) return null;
  const start = new Date(startDatum);
  const eind = new Date(eindDatum);
  const nu = getNow();
  const totaalDagen = Math.ceil((eind - start) / (1000 * 60 * 60 * 24)) + 1;
  const totaalWeken = Math.max(1, Math.ceil(totaalDagen / 7));
  const verstrekenDagen = Math.max(0, Math.floor((nu - start) / (1000 * 60 * 60 * 24)));
  const verstrekenWeken = Math.floor(verstrekenDagen / 7);
  const dagenOver = Math.max(0, Math.ceil((eind - nu) / (1000 * 60 * 60 * 24)));
  return {
    weken: verstrekenWeken,
    totaal: totaalWeken,
    dagenOver: dagenOver,
  };
}

function berekenLogboekProgress(stageId, startDatum, eindDatum) {
  const empty = { ingediend: 0, totaal: 0, goedgekeurd: 0, laasteLogboek: null };
  if (!startDatum || !eindDatum || !stageId) return empty;

  const start = new Date(startDatum);
  const eind = new Date(eindDatum);
  const nu = getNow();

  const totaalDagen = Math.ceil((eind - start) / (1000 * 60 * 60 * 24)) + 1;
  const totalWeeks = Math.max(1, Math.ceil(totaalDagen / 7));

  function getWeekDates(weekIndex) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + weekIndex * 7);
    while (weekStart.getDay() === 0 || weekStart.getDay() === 6) {
      weekStart.setDate(weekStart.getDate() + 1);
    }
    const weekEnd = new Date(weekStart);
    let count = 1;
    while (count < 5) {
      weekEnd.setDate(weekEnd.getDate() + 1);
      if (weekEnd.getDay() !== 0 && weekEnd.getDay() !== 6) count++;
    }
    if (eind && weekEnd > eind) {
      weekEnd.setTime(eind.getTime());
    }
    return { startDateObj: new Date(weekStart), endDateObj: new Date(weekEnd) };
  }

  return fetch('/api/logboek/stage/' + stageId, { credentials: 'include' })
    .then(function(res) { return res.json(); })
    .then(function(entries) {
      if (!Array.isArray(entries)) return empty;

      let submittedWeeks = 0;
      let goedgekeurdWeeks = 0;
      let laasteLogboek = null;

      for (let w = 0; w < totalWeeks; w++) {
        const dates = getWeekDates(w);
        const weekEntries = entries.filter(function(e) {
          if (!e.datum) return false;
          const d = new Date(e.datum);
          return d >= dates.startDateObj && d <= dates.endDateObj;
        });
        if (weekEntries.length > 0) {
          const allIngevuld = weekEntries.every(function(e) { return e.status === 'INGEVULD'; });
          if (allIngevuld) submittedWeeks++;
        }
      }

      var filledEntries = entries.filter(function(e) { return e.status === 'INGEVULD' && e.datum; });
      if (filledEntries.length > 0) {
        filledEntries.sort(function(a, b) { return new Date(b.datum) - new Date(a.datum); });
        laasteLogboek = new Date(filledEntries[0].datum).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      return {
        ingediend: submittedWeeks,
        totaal: totalWeeks,
        goedgekeurd: submittedWeeks,
        laasteLogboek: laasteLogboek,
      };
    })
    .catch(function() { return empty; });
}

function normalizeDate(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function bepaalMijlpalen(rawStatus, startDatum, eindDatum) {
  const volgorde = ['AANVRAAG', 'GOEDGEKEURD', 'DOCUMENTGEUPLOADED', 'KLAAR'];
  const huidigeIndex = volgorde.indexOf(rawStatus);

  const isGoedgekeurd = huidigeIndex >= volgorde.indexOf('GOEDGEKEURD');
  const isDocumentIngediend = huidigeIndex >= volgorde.indexOf('DOCUMENTGEUPLOADED');
  const isKlaar = rawStatus === 'KLAAR';

  let isTussentijds = false;
  if (startDatum && eindDatum) {
    const nu = getNow();
    const start = new Date(startDatum);
    const eind = new Date(eindDatum);
    const midpoint = new Date((start.getTime() + eind.getTime()) / 2);
    isTussentijds = nu >= midpoint && !isKlaar;
  }

  return [
    { label: 'Voorstel goedgekeurd', gedaan: isGoedgekeurd },
    { label: 'Overeenkomst ondertekend', gedaan: isDocumentIngediend },
    { label: 'Stage gestart', gedaan: startDatum ? normalizeDate(startDatum) <= normalizeDate(getNow()) : false },
    { label: 'Tussentijdse evaluatie', gedaan: isTussentijds },
    { label: 'Finale evaluatie', gedaan: isKlaar },
  ];
}

function mapFrontendStatus(rawStatus) {
  if (rawStatus === 'AANVRAAG') return 'in_afwachting';
  if (rawStatus === 'KLAAR') return 'afgelopen';
  if (rawStatus === 'GOEDGEKEURD' || rawStatus === 'DOCUMENTGEUPLOADED') return 'lopend';
  if (rawStatus === 'AFGEKEURD') return 'afgekeurd';
  if (rawStatus === 'AANPASSINGENVEREISD') return 'aanpassingen';
  return 'lopend';
}

function renderMijlpalen(lijst) {
  return lijst.map(function(m, i) {
    const lijn = i < lijst.length - 1
      ? `<div class="dc-mijlpaal-lijn${m.gedaan && lijst[i + 1].gedaan ? ' dc-mijlpaal-lijn--gedaan' : ''}"></div>`
      : '';
    return `
      <div class="dc-mijlpaal">
        <div class="dc-mijlpaal-cirkel dc-mijlpaal-cirkel--${m.gedaan ? 'gedaan' : 'open'}">
          ${m.gedaan ? '&#10003;' : i + 1}
        </div>
        <span class="dc-mijlpaal-label">${m.label}</span>
      </div>
      ${lijn}
    `;
  }).join('');
}

function renderKaartAfwachting(s) {
  return `
    <div class="dc-card">
      <div class="dc-card-top">
        <div>
          <h2 class="dc-card-naam">${s.naam}</h2>
          <p class="dc-card-bedrijf">${s.bedrijf}</p>
        </div>
        <span class="dc-badge dc-badge--afwachting">In afwachting van commissie</span>
      </div>
      <div class="dc-meta">
        <span><strong>Mentor:</strong> ${s.mentor}</span>
        <span><strong>Periode:</strong> ${s.periodeStart} – ${s.periodeEind}</span>
      </div>
      <p class="dc-mijlpalen-label">Mijlpalen</p>
      <div class="dc-mijlpalen">
        ${renderMijlpalen(s.mijlpalen)}
      </div>
      <div class="dc-card-footer">
        <span class="dc-laatste-logboek dc-laatste-logboek--leeg">Nog geen logboeken</span>
        <button class="dc-btn dc-btn--afwachting" disabled>In afwachting van commissie</button>
      </div>
    </div>
  `;
}

function renderKaarten(lijst) {
  return lijst.map(function(s) {
    if (s.status === 'in_afwachting') return renderKaartAfwachting(s);
    const periodePercent = s.voortgang ? Math.round((s.voortgang.weken / s.voortgang.totaal) * 100) : 0;
    const logboekPercent = s.logboek && s.logboek.totaal > 0 ? Math.round((s.logboek.ingediend / s.logboek.totaal) * 100) : 0;

    return `
      <div class="dc-card dc-card--clickable" data-student-id="${s.id}">
        <div class="dc-card-top">
          <div>
            <h2 class="dc-card-naam">${s.naam}</h2>
            <p class="dc-card-bedrijf">${s.bedrijf}</p>
          </div>
          <div class="dc-badges">
            <span class="dc-badge dc-badge--${s.status === 'afgelopen' ? 'afgerond' : 'lopend'}">${s.status === 'afgelopen' ? 'Afgerond' : 'Lopend'}</span>
            ${s.nieuwLogboek > 0 ? `<span class="dc-badge dc-badge--logboek">${s.nieuwLogboek} nieuw logboek</span>` : ''}
          </div>
        </div>
        <div class="dc-meta">
          <span><strong>Mentor:</strong> ${s.mentor}</span>
          <span><strong>Periode:</strong> ${s.periodeStart} – ${s.periodeEind}</span>
        </div>
        <div class="dc-voortgang">
          <div class="dc-voortgang-rij">
            <span class="dc-voortgang-label">Voortgang stageperiode</span>
            <div class="dc-voortgang-bar-wrap">
              <div class="dc-voortgang-bar dc-voortgang-bar--periode" style="width: ${periodePercent}%"></div>
            </div>
            <span class="dc-voortgang-info">${s.voortgang ? s.voortgang.weken + ' / ' + s.voortgang.totaal + ' weken' + (s.voortgang.dagenOver > 0 ? ' · nog ' + s.voortgang.dagenOver + ' dagen' : '') : 'Geen data'}</span>
          </div>
          <div class="dc-voortgang-rij">
            <span class="dc-voortgang-label">Logboek</span>
            <div class="dc-voortgang-bar-wrap">
              <div class="dc-voortgang-bar dc-voortgang-bar--logboek" style="width: ${logboekPercent}%"></div>
            </div>
            <span class="dc-voortgang-info">${s.logboek ? s.logboek.ingediend + ' / ' + s.logboek.totaal + ' weken ingediend · ' + s.logboek.goedgekeurd + ' goedgekeurd' : 'Geen logboeken'}</span>
          </div>
        </div>
        <div class="dc-mijlpalen">
          ${renderMijlpalen(s.mijlpalen)}
        </div>
        <div class="dc-card-footer">
          <span class="dc-laatste-logboek">${s.laasteLogboek ? 'Laatste logboek: ' + s.laasteLogboek : 'Nog geen logboeken'}</span>
          ${s.eindpunt ? `<span class="dc-badge dc-badge--eindpunt">Eindpunt: ${s.eindpunt}</span>` : ''}
          <button class="dc-btn" data-id="${s.id}" data-student-id="${s.studentId}">Student Bekijken</button>
        </div>
      </div>
    `;
  }).join('');
}

function setupFilter(studenten) {
  document.querySelectorAll('.dc-nav-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.dc-nav-item').forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');

      const filter = item.dataset.filter;
      const gefilterd = filter === 'actief'
        ? studenten.filter(function(s) { return s.status === 'lopend'; })
        : filter === 'alle'
          ? studenten
              .filter(function(s) { return s.status === 'lopend' || s.status === 'in_afwachting'; })
              .sort(function(a, b) { return a.status === 'in_afwachting' ? -1 : 1; })
          : filter === 'afgelopen'
            ? studenten.filter(function(s) { return s.status === 'afgelopen'; })
            : [];

      document.querySelector('.dc-kaarten').innerHTML = renderKaarten(gefilterd);
      setupStudentButtons(studenten);
    });
  });
}

function setupStudentButtons(studenten) {
  document.querySelectorAll('.dc-card--clickable').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.dc-btn')) return;
      const id = parseInt(card.dataset.studentId);
      const student = studenten.find(function(s) { return s.id === id; });
      if (!student) return;
      import('./student-detail.js').then(function(m) { m.renderStudentDetail(student, renderMijnStudenten._user); });
    });
  });
}

export async function renderMijnStudenten(app, user) {
  const container = app || document.querySelector('#app');
  let stages = [];
  renderMijnStudenten._user = user || null;
  lastApp = app;
  lastUser = user;

  if (user && user.user_id) {
    try {
      const res = await fetch('/api/stages/docent/' + user.user_id, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) stages = data;
    } catch (err) {
      console.error('Fout bij ophalen stages:', err);
    }
  }

  const studenten = await Promise.all(stages.map(async function(s) {
    const frontendStatus = mapFrontendStatus(s.rawStatus);
    const voortgang = berekenVoortgang(s.stageDetails.start, s.stageDetails.einde);
    const logboek = await berekenLogboekProgress(s.id, s.stageDetails.start, s.stageDetails.einde);
    return {
      id: s.id,
      studentId: s.studentId,
      naam: s.naam,
      email: s.studentEmail,
      bedrijf: s.bedrijf.naam || 'Onbekend bedrijf',
      mentor: s.stagementor.naam || 'Geen mentor',
      startDatum: s.stageDetails.start || null,
      eindDatum: s.stageDetails.einde || null,
      periodeStart: s.stageDetails.start ? new Date(s.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : '–',
      periodeEind: s.stageDetails.einde ? new Date(s.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : '–',
      status: frontendStatus,
      rawStatus: s.rawStatus,
      nieuwLogboek: 0,
      voortgang: voortgang,
      logboek: logboek,
      mijlpalen: bepaalMijlpalen(s.rawStatus, s.stageDetails.start, s.stageDetails.einde),
      laasteLogboek: logboek.laasteLogboek,
      stageData: s,
    };
  }));

  const actief    = studenten.filter(function(s) { return s.status === 'lopend'; });
  const afgelopen = studenten.filter(function(s) { return s.status === 'afgelopen'; });
  const displayName = user ? (user.last_name ? user.last_name.toUpperCase() + ' ' + user.first_name : user.first_name || 'Docent') : 'Docent';

  container.innerHTML = `
    <div class="dc-layout">
      <aside class="dc-sidebar">
        <div class="dc-sidebar-top">
          <span class="dc-logo-title">EhB-docent</span>
          <span class="dc-logo-sub">Erasmushogeschool Brussel</span>
          <nav class="dc-nav">
            <a href="#" class="dc-nav-item active" data-filter="actief">Actieve stages <span class="dc-nav-count">(${actief.length})</span></a>
            <a href="#" class="dc-nav-item" data-filter="alle">Alle studenten <span class="dc-nav-count">(${studenten.length})</span></a>
            <a href="#" class="dc-nav-item" data-filter="afgelopen">Afgelopen stages <span class="dc-nav-count">(${afgelopen.length})</span></a>
          </nav>
        </div>
        <div class="dc-sidebar-bottom">
          <span class="dc-user-name">Prof. ${displayName}</span>
          <a href="/" class="dc-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="dc-main">
        <h1 class="dc-main-title">Mijn Studenten</h1>
        <p class="dc-main-sub">Welkom, Prof. ${displayName}</p>
        <div class="dc-kaarten">
          ${studenten.length > 0 ? renderKaarten(actief) : '<p>Geen actieve stages gevonden.</p>'}
        </div>
      </main>
    </div>

    <div class="test-date-picker">
      <label class="test-date-label">Test datum:</label>
      <input type="date" id="test-date-input" class="test-date-input" value="${testDateOverride ? testDateOverride.toISOString().split('T')[0] : ''}">
      <button class="test-date-apply" id="test-date-apply">Zet</button>
      <button class="test-date-reset" id="test-date-reset">Reset</button>
    </div>
  `;

  setupFilter(studenten);
  setupStudentButtons(studenten);

  var testInput = document.getElementById('test-date-input');
  var testApply = document.getElementById('test-date-apply');
  var testReset = document.getElementById('test-date-reset');

  if (testApply) {
    testApply.addEventListener('click', function() {
      if (testInput.value) {
        testDateOverride = new Date(testInput.value + 'T00:00:00');
        renderMijnStudenten(lastApp, lastUser);
      }
    });
  }

  if (testReset) {
    testReset.addEventListener('click', function() {
      testDateOverride = null;
      testInput.value = '';
      renderMijnStudenten(lastApp, lastUser);
    });
  }
}
