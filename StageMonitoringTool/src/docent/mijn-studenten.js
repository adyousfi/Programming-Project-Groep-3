import './mijn-studenten.css';
import { studentenMockdata as studenten } from '../data/mockdata.js';

async function logout() {
  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.error('Fout bij uitloggen:', err);
  } finally {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  }
}

function renderMijlpalen(lijst) {
  return lijst.map(function(m, i) {
    const lijn = i < lijst.length - 1
      ? `<div class="dc-mijlpaal-lijn${m.gedaan && lijst[i + 1].gedaan ? ' dc-mijlpaal-lijn--gedaan' : ''}"></div>`
      : '';
    return `
      <div class="dc-mijlpaal">
        <div class="dc-mijlpaal-cirkel dc-mijlpaal-cirkel--${m.gedaan ? 'gedaan' : 'open'}">
          ${m.gedaan ? '✓' : i + 1}
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
          <p class="dc-card-functie">${s.functie}</p>
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
    const periodePercent = Math.round((s.voortgang.weken / s.voortgang.totaal) * 100);
    const logboekPercent = Math.round((s.logboek.ingediend / s.logboek.totaal) * 100);

    return `
      <div class="dc-card">
        <div class="dc-card-top">
          <div>
            <h2 class="dc-card-naam">${s.naam}</h2>
            <p class="dc-card-functie">${s.functie}</p>
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
            <span class="dc-voortgang-info">${s.voortgang.weken} / ${s.voortgang.totaal} weken${s.voortgang.dagenOver > 0 ? ` · nog ${s.voortgang.dagenOver} dagen` : ''}</span>
          </div>
          <div class="dc-voortgang-rij">
            <span class="dc-voortgang-label">Logboek</span>
            <div class="dc-voortgang-bar-wrap">
              <div class="dc-voortgang-bar dc-voortgang-bar--logboek" style="width: ${logboekPercent}%"></div>
            </div>
            <span class="dc-voortgang-info">${s.logboek.ingediend} / ${s.logboek.totaal} weken ingediend · ${s.logboek.goedgekeurd} goedgekeurd</span>
          </div>
        </div>
        <div class="dc-mijlpalen">
          ${renderMijlpalen(s.mijlpalen)}
        </div>
        <div class="dc-card-footer">
          <span class="dc-laatste-logboek">Laatste logboek: ${s.laasteLogboek}</span>
          ${s.eindpunt ? `<span class="dc-badge dc-badge--eindpunt">Eindpunt: ${s.eindpunt}</span>` : ''}
          <button class="dc-btn" data-id="${s.id}">Student Bekijken</button>
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
      import('./student-detail.js').then(function(m) { m.renderStudentDetail(student); });
    });
  });
}

export function renderMijnStudenten() {
  const actief    = studenten.filter(function(s) { return s.status === 'lopend'; });
  const afgelopen = studenten.filter(function(s) { return s.status === 'afgelopen'; });

  // ✅ 1. eerst HTML renderen
  document.querySelector('#app').innerHTML = `
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
          <span class="dc-user-name">Prof. Sarah Claes</span>
          <button id="logout-btn" class="dc-logout">Uitloggen</button>
        </div>
      </aside>
      <main class="dc-main">
        <h1 class="dc-main-title">Mijn Studenten</h1>
        <p class="dc-main-sub">Welkom, Prof. Sarah Claes</p>
        <div class="dc-kaarten">
          ${renderKaarten(actief)}
        </div>
      </main>
    </div>
  `;

  // ✅ 2. daarna pas event listeners toevoegen
  setupFilter(studenten);
  setupStudentButtons(studenten);
  document.getElementById('logout-btn').addEventListener('click', logout);
}