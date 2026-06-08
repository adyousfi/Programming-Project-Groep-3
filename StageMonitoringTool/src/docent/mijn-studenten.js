import './mijn-studenten.css';
import { studentenMockdata as studenten } from '../data/mockdata.js';

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

function renderKaarten(lijst) {
  return lijst.map(function(s) {
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
            <span class="dc-badge dc-badge--${s.status}">${s.status === 'lopend' ? 'Lopend' : 'Afgelopen'}</span>
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
          <button class="dc-btn" data-id="${s.id}">Student Bekijken</button>
        </div>
      </div>
    `;
  }).join('');
}

export function renderMijnStudenten() {
  const actief = studenten.filter(function(s) { return s.status === 'lopend'; });

  document.querySelector('#app').innerHTML = `
    <div class="dc-layout">
      <aside class="dc-sidebar">
        <div class="dc-sidebar-top">
          <span class="dc-logo-title">EhB-docent</span>
          <span class="dc-logo-sub">Erasmushogeschool Brussel</span>
          <nav class="dc-nav">
            <a href="#" class="dc-nav-item active" data-filter="actief">Actieve stages</a>
            <a href="#" class="dc-nav-item" data-filter="alle">Alle studenten</a>
            <a href="#" class="dc-nav-item" data-filter="afgelopen">Afgelopen stages</a>
          </nav>
        </div>
        <div class="dc-sidebar-bottom">
          <span class="dc-user-name">Prof. Sarah Claes</span>
          <a href="/" class="dc-logout">Uitloggen</a>
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
}
