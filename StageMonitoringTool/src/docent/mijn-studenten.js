import './mijn-studenten.css';

function berekenVoortgang(startDatum, eindDatum) {
  if (!startDatum || !eindDatum) return null;
  const start = new Date(startDatum);
  const eind = new Date(eindDatum);
  const nu = new Date();
  const totaalMs = eind - start;
  const verstrekenMs = nu - start;
  const totaalWeken = Math.ceil(totaalMs / (7 * 24 * 60 * 60 * 1000));
  const verstrekenWeken = Math.max(0, Math.floor(verstrekenMs / (7 * 24 * 60 * 60 * 1000)));
  const dagenOver = Math.max(0, Math.ceil((eind - nu) / (24 * 60 * 60 * 1000)));
  return {
    weken: verstrekenWeken,
    totaal: totaalWeken,
    dagenOver: dagenOver,
  };
}

function bepaalMijlpalen(rawStatus) {
  const stappen = [
    { label: 'Voorstel goedgekeurd', key: 'GOEDGEKEURD' },
    { label: 'Overeenkomst ondertekend', key: 'GOEDGEKEURD' },
    { label: 'Stage gestart', key: 'GOEDGEKEURD' },
    { label: 'Tussentijdse evaluatie', key: 'DOCUMENTGEUPLOADED' },
    { label: 'Finale evaluatie', key: 'KLAAR' },
  ];
  const volgorde = ['AANVRAAG', 'GOEDGEKEURD', 'DOCUMENTGEUPLOADED', 'KLAAR'];
  const huidigeIndex = volgorde.indexOf(rawStatus);
  return stappen.map(function(s) {
    const stapIndex = volgorde.indexOf(s.key);
    return { label: s.label, gedaan: stapIndex <= huidigeIndex && huidigeIndex >= 0 };
  });
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
      <div class="dc-card">
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
  document.querySelectorAll('.dc-btn[data-id]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const id = parseInt(btn.dataset.id);
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

  if (user && user.user_id) {
    try {
      const res = await fetch('/api/stages/docent/' + user.user_id, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) stages = data;
    } catch (err) {
      console.error('Fout bij ophalen stages:', err);
    }
  }

  const studenten = stages.map(function(s) {
    const frontendStatus = mapFrontendStatus(s.rawStatus);
    const voortgang = berekenVoortgang(s.stageDetails.start, s.stageDetails.einde);
    return {
      id: s.id,
      studentId: s.studentId,
      naam: s.naam,
      email: s.studentEmail,
      bedrijf: s.bedrijf.naam || 'Onbekend bedrijf',
      mentor: s.stagementor.naam || 'Geen mentor',
      periodeStart: s.stageDetails.start ? new Date(s.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : '–',
      periodeEind: s.stageDetails.einde ? new Date(s.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : '–',
      status: frontendStatus,
      rawStatus: s.rawStatus,
      nieuwLogboek: 0,
      voortgang: voortgang,
      logboek: { ingediend: 0, totaal: voortgang ? voortgang.totaal : 0, goedgekeurd: 0 },
      mijlpalen: bepaalMijlpalen(s.rawStatus),
      laasteLogboek: null,
    };
  });

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
  `;

  setupFilter(studenten);
  setupStudentButtons(studenten);
}
