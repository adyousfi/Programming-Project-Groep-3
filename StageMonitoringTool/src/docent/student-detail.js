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
          <p class="sd-stat-sub">${student.functie}</p>
        </div>
      </div>
    </div>
  `;
}

function renderTabContent(tab, student) {
  if (tab === 'overzicht') return renderOverzicht(student);
  return `<div class="sd-tab-content"></div>`;
}

export function renderStudentDetail(student) {
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
          <span class="sd-user-name">Prof. Sarah Claes</span>
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
    import('./mijn-studenten.js').then(function(m) { m.renderMijnStudenten(); });
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
