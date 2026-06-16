import './student-detail.css';

const navItems = [
  { id: 'overzicht',    label: 'Overzicht' },
  { id: 'stagedetails', label: 'Stagedetails' },
  { id: 'documenten',   label: 'Documenten' },
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

function renderTabContent(tab, student) {
  if (tab === 'overzicht') return renderOverzicht(student);
  return `<div class="sd-tab-content"></div>`;
}

export function renderStudentDetail(student, user) {
  const displayName = user ? (user.last_name ? user.last_name.toUpperCase() + ' ' + user.first_name : user.first_name || 'Docent') : 'Docent';

  document.querySelector('#app').innerHTML = `
    <div class="sd-layout">
      <aside class="sd-sidebar">
        <div class="sd-sidebar-top">
          <span class="sd-logo-title">Stage Monitoring</span>
          <span class="sd-logo-sub">Erasmushogeschool Brussel</span>
          <nav class="sd-nav">
            ${renderNav('overzicht')}
          </nav>
        </div>
        <div class="sd-sidebar-bottom">
          <span class="sd-user-name">Prof. ${displayName}</span>
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
          ${renderTabContent('overzicht', student)}
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sd-terug').addEventListener('click', function(e) {
    e.preventDefault();
    import('./mijn-studenten.js').then(function(m) { m.renderMijnStudenten(document.querySelector('#app'), user); });
  });

  document.querySelectorAll('.sd-nav-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.sd-nav-item').forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');
      document.querySelector('#sd-content').innerHTML = renderTabContent(item.dataset.tab, student);
    });
  });
}
