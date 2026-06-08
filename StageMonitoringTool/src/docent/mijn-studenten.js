import './mijn-studenten.css';
import { studentenMockdata as studenten } from '../data/mockdata.js';

function renderKaarten(lijst) {
  return lijst.map(function(s) {
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
