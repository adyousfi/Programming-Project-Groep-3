import './student-detail.css';
import '../student/stagedetails.css';

let logboekEntriesCache = [];
let currentWeekNumber = 1;
let totalWeeks = 1;

const navItems = [
  { id: 'overzicht',    label: 'Overzicht' },
  { id: 'stagedetails', label: 'Stagedetails' },
  { id: 'logboek',      label: 'Logboek' },
  { id: 'evaluatie',    label: 'Evaluatie' },
];

function renderNav(activeTab) {
  return navItems.map(function(item) {
    return `<a href="#" class="sd-nav-item${item.id === activeTab ? ' active' : ''}" data-tab="${item.id}">${item.label}</a>`;
  }).join('');
}

function renderOverzicht(student) {
  const logboekPercent = student.logboek
    ? Math.round((student.logboek.ingediend / student.logboek.totaal) * 100)
    : 0;

  return `
    <div class="sd-tab-content">
      <div class="sd-stat-grid">
        <div class="sd-stat-card">
          <p class="sd-stat-label">Stage Periode</p>
          <p class="sd-stat-value">${student.periodeStart} – ${student.periodeEind}</p>
          <p class="sd-stat-sub">${student.voortgang ? student.voortgang.totaal : '–'} weken totaal</p>
        </div>
        <div class="sd-stat-card">
          <p class="sd-stat-label">Logboek Status</p>
          <p class="sd-stat-value">${student.logboek ? `${student.logboek.ingediend} / ${student.logboek.totaal} weken` : '–'}</p>
          <div class="sd-progress-bar-wrap">
            <div class="sd-progress-bar" style="width: ${logboekPercent}%"></div>
          </div>
        </div>
        <div class="sd-stat-card">
          <p class="sd-stat-label">Bedrijf</p>
          <p class="sd-stat-value">${student.bedrijf}</p>
        </div>
      </div>

      <div class="sd-actie-grid">
        <div class="sd-actie-card" data-actie="logboek">
          <div class="sd-actie-icon sd-actie-icon--blauw">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <p class="sd-actie-titel">Logboek Controleren</p>
            <p class="sd-actie-sub">Bekijk dagelijkse activiteiten</p>
          </div>
        </div>
        <div class="sd-actie-card" data-actie="evaluatie">
          <div class="sd-actie-icon sd-actie-icon--paars">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div>
            <p class="sd-actie-titel">Evaluaties</p>
            <p class="sd-actie-sub">Geef feedback en beoordeling</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatDate(d) {
  return d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
}

function getWeekDates(startDate, endDate, weekIndex) {
  if (!startDate) return { start: '?', end: '?', days: 5, startDateObj: null, endDateObj: null };
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + weekIndex * 7);
  while (weekStart.getDay() === 0 || weekStart.getDay() === 6) {
    weekStart.setDate(weekStart.getDate() + 1);
  }
  const weekEnd = new Date(weekStart);
  let weekdayCount = 1;
  while (weekdayCount < 5) {
    weekEnd.setDate(weekEnd.getDate() + 1);
    if (weekEnd.getDay() !== 0 && weekEnd.getDay() !== 6) weekdayCount++;
  }
  if (endDate && weekEnd > endDate) {
    weekEnd.setTime(endDate.getTime());
    let count = 0;
    const temp = new Date(weekStart);
    while (temp <= weekEnd) {
      if (temp.getDay() !== 0 && temp.getDay() !== 6) count++;
      temp.setDate(temp.getDate() + 1);
    }
    weekdayCount = Math.max(1, count);
  }
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
    days: weekdayCount,
    startDateObj: new Date(weekStart),
    endDateObj: new Date(weekEnd)
  };
}

async function renderLogboekTab(student) {
  const startDate = student.startDatum ? new Date(student.startDatum) : null;
  const endDate = student.eindDatum ? new Date(student.eindDatum) : null;

  logboekEntriesCache = [];
  if (student.id) {
    try {
      const res = await fetch('/api/logboek/stage/' + student.id, { credentials: 'include' });
      logboekEntriesCache = await res.json();
      if (!Array.isArray(logboekEntriesCache)) logboekEntriesCache = [];
    } catch (err) {
      console.error('Error fetching logboek:', err);
    }
  }

  if (startDate && endDate) {
    totalWeeks = 1;
    const nextStart = new Date(startDate);
    nextStart.setHours(12, 0, 0, 0);
    const startDay = nextStart.getDay();
    const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
    nextStart.setDate(nextStart.getDate() + daysToMonday);
    const endObj = new Date(endDate);
    endObj.setHours(12, 0, 0, 0);
    while (nextStart <= endObj) {
      totalWeeks++;
      nextStart.setDate(nextStart.getDate() + 7);
    }
  } else {
    totalWeeks = 16;
  }

  const weeks = Array.from({ length: Math.max(1, totalWeeks) }, function(_, i) {
    const dates = getWeekDates(startDate, endDate, i);
    let daysFilled = 0;
    let allIngevuld = false;
    let allGevinkt = false;
    let hasEntries = false;

    if (dates.startDateObj) {
      const weekEntries = logboekEntriesCache.filter(function(e) {
        if (!e.datum) return false;
        const entryDate = new Date(e.datum);
        return entryDate >= dates.startDateObj && entryDate <= dates.endDateObj;
      });
      hasEntries = weekEntries.length > 0;
      const validatedEntries = weekEntries.filter(function(e) { return e.status === 'INGEVULD' && e.gevinkt_door_stagementor; });
      const filledEntries = weekEntries.filter(function(e) { return e.status === 'INGEVULD'; });
      
      daysFilled = validatedEntries.length;
      allIngevuld = dates.days > 0 && filledEntries.length === dates.days;
      allGevinkt = dates.days > 0 && validatedEntries.length === dates.days;
    }

    let status = 'not_submitted';
    if (allGevinkt) status = 'afgevinkt';
    else if (allIngevuld) status = 'submitted';
    else if (hasEntries) status = 'in_progress';

    return {
      number: i + 1,
      start: dates.start,
      end: dates.end,
      daysFilled: daysFilled,
      totalDays: dates.days,
      status: status
    };
  });

  let html = '<div class="sd-tab-content">';
  html += '<h2 class="sd-logboek-title">Logboek - Weekoverzicht</h2>';
  html += '<p class="sd-logboek-sub">Bekijk het logboek van deze student per week.</p>';
  html += '<div class="sd-logboek-weeks">';

  weeks.forEach(function(w) {
    var progress = w.totalDays > 0 ? (w.daysFilled / w.totalDays) * 100 : 0;
    var statusBadge = '';
    if (w.status === 'afgevinkt') {
      statusBadge = '<span class="sd-logboek-badge sd-logboek-badge--validated">Afgevinkt door stagementor</span>';
    } else if (w.status === 'submitted') {
      statusBadge = '<span class="sd-logboek-badge sd-logboek-badge--validated">Ingediend</span>';
    } else if (w.status === 'in_progress') {
      statusBadge = '<span class="sd-logboek-badge sd-logboek-badge--pending">Bezig</span>';
    } else {
      statusBadge = '<span class="sd-logboek-badge sd-logboek-badge--pending">Nog niet ingediend</span>';
    }

    html += '<div class="sd-logboek-week-card" data-week="' + w.number + '">';
    html += '<div class="sd-logboek-week-left">';
    html += '<span class="sd-logboek-week-name">Week ' + w.number + '</span>';
    html += '<span class="sd-logboek-week-dates">' + w.start + ' t/m ' + w.end + '</span>';
    html += '</div>';
    html += '<div class="sd-logboek-week-right">';
    html += '<div class="sd-logboek-week-progress-wrap">';
    html += '<span class="sd-logboek-week-count">' + w.daysFilled + '/' + w.totalDays + ' dagen ingevuld</span>';
    html += '<div class="sd-logboek-week-bar">';
    html += '<div class="sd-logboek-week-bar-fill" style="width: ' + progress + '%"></div>';
    html += '</div>';
    html += '</div>';
    html += statusBadge;
    html += '</div>';
    html += '</div>';
  });

  html += '</div></div>';
  return html;
}

function renderStagedetailsTab(student) {
  const sd = student.stageData || {};
  const bedrijfNaam = sd.bedrijf?.naam || student.bedrijf || '–';
  const bedrijfAdres = sd.bedrijf?.adres || '–';
  const mentorNaam = sd.stagementor?.naam || student.mentor || '–';
  const mentorEmail = sd.stagementor?.email || '–';
  const docentNaam = sd.docent?.naam || 'Niet toegewezen';
  const omschrijving = sd.stageDetails?.omschrijving || 'Geen omschrijving beschikbaar';

  let startDatum = '–';
  let eindDatum = '–';
  if (sd.stageDetails?.start) {
    startDatum = new Date(sd.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (sd.stageDetails?.einde) {
    eindDatum = new Date(sd.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const statusClass = sd.rawStatus === 'GOEDGEKEURD' ? 'status-goedgekeurd'
    : sd.rawStatus === 'AANVRAAG' ? 'status-in_afwachting'
    : sd.rawStatus === 'AFGEKEURD' ? 'status-afgekeurd'
    : sd.rawStatus === 'DOCUMENTGEUPLOADED' ? (sd.document_validated ? 'status-goedgekeurd' : 'status-in_afwachting')
    : 'status-goedgekeurd';
  const statusLabel = sd.rawStatus === 'GOEDGEKEURD' ? 'Goedgekeurd'
    : sd.rawStatus === 'AANVRAAG' ? 'In afwachting'
    : sd.rawStatus === 'AFGEKEURD' ? 'Afgekeurd'
    : sd.rawStatus === 'DOCUMENTGEUPLOADED' ? (sd.document_validated ? 'Document gevalideerd' : 'Document geüpload')
    : sd.rawStatus || 'Onbekend';

  return `
    <div class="sd-tab-content">
      <span class="status-badge ${statusClass}">${statusLabel}</span>
      <div class="details-card">
        <div class="detail-section">
          <h3 class="detail-label">Student</h3>
          <p class="detail-value">${student.naam || '–'}</p>
        </div>
        <div class="detail-section">
          <h3 class="detail-label">Bedrijf</h3>
          <p class="detail-value">${bedrijfNaam}</p>
          <p class="detail-sub">${bedrijfAdres}</p>
        </div>
        <div class="detail-section">
          <h3 class="detail-label">Stagementor</h3>
          <p class="detail-value">${mentorNaam}</p>
          <p class="detail-sub">${mentorEmail}</p>
        </div>
        <div class="detail-section">
          <h3 class="detail-label">Toegewezen EhB-docent</h3>
          <p class="detail-value">${docentNaam}</p>
        </div>
        <div class="detail-section">
          <h3 class="detail-label">Periode</h3>
          <p class="detail-value">${startDatum} t/m ${eindDatum}</p>
        </div>
        <div class="detail-section">
          <h3 class="detail-label">Omschrijving van de opdracht</h3>
          <p class="detail-sub">${omschrijving}</p>
        </div>
      </div>
    </div>
  `;
}

async function renderTabContent(tab, student) {
  if (tab === 'overzicht') return renderOverzicht(student);
  if (tab === 'stagedetails') return renderStagedetailsTab(student);
  if (tab === 'logboek') return await renderLogboekTab(student);
  return `<div class="sd-tab-content"></div>`;
}

export async function renderStudentDetail(student, user, initialTab) {
  const displayName = user ? (user.last_name ? user.last_name.toUpperCase().replace(/^PROF\.\s*/i, '') + ' ' + (user.first_name || '').replace(/^Prof\.\s*/i, '') : (user.first_name || '').replace(/^Prof\.\s*/i, '') || 'Docent') : 'Docent';
  const startTab = initialTab || 'overzicht';

  document.querySelector('#app').innerHTML = `
    <div class="sd-layout">
      <aside class="sd-sidebar">
        <div class="sd-sidebar-top">
          <div class="sd-logo">
            <span class="sd-logo-title">Stage Monitoring</span>
            <span class="sd-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sd-nav">
            ${renderNav(startTab)}
          </nav>
        </div>
        <div class="sd-sidebar-bottom">
          <span class="sd-user-name">Docent ${displayName}</span>
          <a href="/" class="sd-logout">Uitloggen</a>
        </div>
      </aside>

      <main class="sd-main">
        <div class="sd-topbar">
          <a href="#" class="sd-terug" id="sd-terug">← Terug naar studenten</a>
        </div>
        <h1 class="sd-title">Student: ${student.naam}</h1>
        <p class="sd-subtitle">${student.email || ''}</p>
        <div class="sd-content" id="sd-content">
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sd-terug').onclick = function(e) {
    e.preventDefault();
    import('./mijn-studenten.js').then(function(m) { m.renderMijnStudenten(document.querySelector('#app'), user); });
  };

  document.querySelectorAll('.sd-nav-item').forEach(function(item) {
    item.addEventListener('click', async function(e) {
      e.preventDefault();
      document.querySelectorAll('.sd-nav-item').forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');

      if (item.dataset.tab === 'evaluatie') {
        import('./evaluatie.js').then((m) => {
          m.renderEvaluatieDocent(document.querySelector('#app'), user, student);
        });
        return;
      }

      document.querySelector('#sd-content').innerHTML = '<p class="sd-tab-content">Laden...</p>';
      var topback = document.querySelector('#sd-terug');
      if (topback) {
        topback.textContent = '← Terug naar studenten';
        topback.onclick = function(e) {
          e.preventDefault();
          import('./mijn-studenten.js').then(function(m) { m.renderMijnStudenten(document.querySelector('#app'), user); });
        };
      }
      document.querySelector('#sd-content').innerHTML = await renderTabContent(item.dataset.tab, student);
      setupWeekCards(student);
        if (item.dataset.tab === 'overzicht') setupActieCards(student, user);

    });
  });


  document.querySelector('#sd-content').innerHTML = await renderTabContent(startTab, student);
  if (startTab === 'overzicht') setupActieCards(student, user);
  if (startTab === 'logboek') setupWeekCards(student);
}

function setupActieCards(student, user) {
  document.querySelectorAll('.sd-actie-card').forEach(function(card) {
    card.addEventListener('click', async function() {
      var actie = card.dataset.actie;
      if (actie === 'evaluatie') {
        document.querySelectorAll('.sd-nav-item').forEach(function(i) { i.classList.remove('active'); });
        var evalTab = document.querySelector('.sd-nav-item[data-tab="evaluatie"]');
        if (evalTab) evalTab.classList.add('active');

        // Zorg dat we in het evaluatie-scherm starten met de juiste tab/rol.
        document.querySelector('#sd-content').innerHTML = '<p class="sd-tab-content">Laden...</p>';
        import('./evaluatie.js').then((m) => {
          // renderEvaluatieDocent geeft intern de tussentijdse evaluatie weer.
          m.renderEvaluatieDocent(document.querySelector('#app'), user, student);
        });

        // In evaluatie.js hangen tab-knoppen (tussentijds/finale) zichzelf correct,
        // maar we willen ook direct dat overzicht/logboek callbacks werken.
        // (Daarvoor gebruiken we de bestaande nav click listeners.)
      }



      if (actie === 'logboek') {
        document.querySelectorAll('.sd-nav-item').forEach(function(i) { i.classList.remove('active'); });
        var logboekTab = document.querySelector('.sd-nav-item[data-tab="logboek"]');
        if (logboekTab) logboekTab.classList.add('active');
        document.querySelector('#sd-content').innerHTML = '<p class="sd-tab-content">Laden...</p>';
        document.querySelector('#sd-content').innerHTML = await renderTabContent('logboek', student);
        setupWeekCards(student);
      }
    });
  });
}

function setupWeekCards(student) {
  document.querySelectorAll('.sd-logboek-week-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var weekNumber = parseInt(card.dataset.week);
      renderLogboekDag(student, weekNumber);
    });
  });
}

function renderLogboekDag(student, weekNumber) {
  currentWeekNumber = weekNumber;
  var startDate = student.startDatum ? new Date(student.startDatum) : null;
  var endDate = student.eindDatum ? new Date(student.eindDatum) : null;
  var dates = getWeekDates(startDate, endDate, weekNumber - 1);

  var weekEntries = logboekEntriesCache.filter(function(e) {
    if (!e.datum || !dates.startDateObj || !dates.endDateObj) return false;
    var d = new Date(e.datum);
    return d >= dates.startDateObj && d <= dates.endDateObj;
  });

  var dagen = [];
  var allDaysIngevuld = false;
  var weekGevinkt = false;
  if (dates.startDateObj) {
    var dag = new Date(dates.startDateObj);
    while (dag <= dates.endDateObj) {
      if (dag.getDay() !== 0 && dag.getDay() !== 6) {
        var dagEntries = weekEntries.filter(function(e) {
          var ed = new Date(e.datum);
          return ed.toDateString() === dag.toDateString();
        });
        var entry = dagEntries.length > 0 ? dagEntries[0] : null;
        dagen.push({
          datum: new Date(dag),
          taken: entry ? entry.uitgevoerdeTaken || '' : '',
          reflectie: entry ? entry.reflectie || '' : '',
          leerpunten: entry ? entry.leerpunten || '' : '',
          status: entry ? entry.status : 'NIETINGEVULD',
          gevinkt: entry ? !!entry.gevinkt_door_stagementor : false
        });
      }
      dag.setDate(dag.getDate() + 1);
    }
    allDaysIngevuld = dagen.length > 0 && dagen.every(function(d) { return d.status === 'INGEVULD'; });
    weekGevinkt = allDaysIngevuld && dagen.every(function(d) { return d.gevinkt; });
  }

  var prevDisabled = weekNumber <= 1 ? ' disabled' : '';
  var nextDisabled = weekNumber >= totalWeeks ? ' disabled' : '';

  var html = '<div class="sd-tab-content">';
  html += '<div class="sd-logboek-nav">';
  html += '<button class="sd-logboek-nav-btn" id="sd-logboek-prev"' + prevDisabled + '>&#8592; Vorige week</button>';
  html += '<span class="sd-logboek-nav-info">Week ' + weekNumber + ' / ' + totalWeeks + '</span>';
  html += '<button class="sd-logboek-nav-btn" id="sd-logboek-next"' + nextDisabled + '>&#8594; Volgende week</button>';
  html += '</div>';
  html += '<h2 class="sd-logboek-title">Week ' + weekNumber + '</h2>';
  html += '<p class="sd-logboek-sub">' + dates.start + ' t/m ' + dates.end + '</p>';

  html += '<div class="sd-logboek-dagen">';

  dagen.forEach(function(d) {
    var statusLabel = '';
    if (d.status === 'INGEVULD') statusLabel = '<span class="sd-logboek-badge sd-logboek-badge--validated">Ingevuld</span>';
    else if (d.status === 'DEELSINGEVULD') statusLabel = '<span class="sd-logboek-badge sd-logboek-badge--pending">Deels ingevuld</span>';
    else statusLabel = '<span class="sd-logboek-badge sd-logboek-badge--pending">Niet ingevuld</span>';

    var datumStr = d.datum.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'short' });

    html += '<div class="sd-logboek-dag-card">';
    html += '<div class="sd-logboek-dag-header">';
    html += '<span class="sd-logboek-dag-datum">' + datumStr + '</span>';
    html += statusLabel;
    html += '</div>';
    html += '<div class="sd-logboek-dag-body">';
    html += '<div class="sd-logboek-dag-field"><strong>Uitgevoerde Taken:</strong><p>' + (d.taken || '–') + '</p></div>';
    html += '<div class="sd-logboek-dag-field"><strong>Reflectie:</strong><p>' + (d.reflectie || '–') + '</p></div>';
    html += '<div class="sd-logboek-dag-field"><strong>Leerpunten:</strong><p>' + (d.leerpunten || '–') + '</p></div>';
    html += '</div>';
    html += '</div>';
  });

  html += '</div></div>';

  document.querySelector('#sd-content').innerHTML = html;

  var topback = document.querySelector('#sd-terug');
  if (topback) {
    var origTerugHandler = topback.onclick;
    topback.textContent = '← Terug naar overzicht';
    topback.onclick = function(e) {
      e.preventDefault();
      topback.textContent = '← Terug naar studenten';
      topback.onclick = origTerugHandler;
      renderLogboekTab(student).then(function(html) {
        document.querySelector('#sd-content').innerHTML = html;
        setupWeekCards(student);
      });
    };
  }

  document.querySelector('#sd-logboek-prev').addEventListener('click', function() {
    if (currentWeekNumber > 1) renderLogboekDag(student, currentWeekNumber - 1);
  });

  document.querySelector('#sd-logboek-next').addEventListener('click', function() {
    if (currentWeekNumber < totalWeeks) renderLogboekDag(student, currentWeekNumber + 1);
  });
}