import './beoordelen.css';

function statusLabel(status) {
  const labels = { in_afwachting: 'In afwachting', goedgekeurd: 'Goedgekeurd', afgekeurd: 'Afgekeurd' };
  return labels[status] || status;
}

export function renderBeoordelen(aanvraag) {
  document.querySelector('#app').innerHTML = `
    <div class="bd-page">
      <header class="bd-header">
        <h1 class="bd-header-title">Stage Monitoring Tool</h1>
        <div class="bd-header-right">
          <div class="bd-header-user">
            <span class="bd-header-naam">Prof. De Vries</span>
            <span class="bd-header-rol">Stagecommissie</span>
          </div>
          <button class="bd-header-btn">Uitloggen</button>
        </div>
      </header>
      <div class="bd-content">
        <a href="#" class="bd-terug" id="bd-terug">← Terug naar dashboard</a>
        <h2 class="bd-titel">Stage Aanvraag Details</h2>

        <div class="bd-card">

          <div class="bd-card-top">
            <div>
              <h3 class="bd-card-functie">${aanvraag.functie}</h3>
              <p class="bd-card-bedrijfnaam">${aanvraag.bedrijf.naam}</p>
            </div>
            <span class="bd-badge bd-badge--${aanvraag.status}">${statusLabel(aanvraag.status)}</span>
          </div>

          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Student</h4>
            <div class="bd-grid">
              <p class="bd-veld"><span class="bd-label">Naam:</span> ${aanvraag.naam}</p>
              <p class="bd-veld"><span class="bd-label">Email:</span> ${aanvraag.studentEmail}</p>
            </div>
          </div>

          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Bedrijf</h4>
            <div class="bd-grid">
              <p class="bd-veld"><span class="bd-label">Naam:</span> ${aanvraag.bedrijf.naam}</p>
              <p class="bd-veld"><span class="bd-label">Adres:</span> ${aanvraag.bedrijf.adres}</p>
              <p class="bd-veld"><span class="bd-label">Contactpersoon:</span> ${aanvraag.bedrijf.contactpersoon}</p>
              <p class="bd-veld"><span class="bd-label">Email:</span> ${aanvraag.bedrijf.email}</p>
              <p class="bd-veld"><span class="bd-label">Telefoon:</span> ${aanvraag.bedrijf.telefoon}</p>
            </div>
          </div>

          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Stagementor</h4>
            <div class="bd-grid">
              <p class="bd-veld"><span class="bd-label">Naam:</span> ${aanvraag.stagementor.naam}</p>
              <p class="bd-veld"><span class="bd-label">Email:</span> ${aanvraag.stagementor.email}</p>
              <p class="bd-veld"><span class="bd-label">Telefoon:</span> ${aanvraag.stagementor.telefoon}</p>
            </div>
          </div>

          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">EhB Docent (Begeleider)</h4>
            <div class="bd-grid">
              <p class="bd-veld"><span class="bd-label">Naam:</span> ${aanvraag.docent.naam}</p>
              <p class="bd-veld"><span class="bd-label">Email:</span> ${aanvraag.docent.email}</p>
            </div>
          </div>

          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Stage Details</h4>
            <p class="bd-veld"><span class="bd-label">Functie:</span> ${aanvraag.functie}</p>
            <p class="bd-veld bd-omschrijving-label">Omschrijving:</p>
            <p class="bd-omschrijving">${aanvraag.stageDetails.omschrijving}</p>
            <div class="bd-grid bd-grid--3">
              <p class="bd-veld"><span class="bd-label">Start:</span> ${aanvraag.stageDetails.start}</p>
              <p class="bd-veld"><span class="bd-label">Einde:</span> ${aanvraag.stageDetails.einde}</p>
              <p class="bd-veld"><span class="bd-label">Uren/week:</span> ${aanvraag.stageDetails.urenPerWeek}</p>
            </div>
          </div>

        </div>

        <div class="bd-card">
          <div class="bd-beoordeling">
            <h4 class="bd-sectie-titel">Beoordeling</h4>
            <div class="bd-info-box">
              <strong>Let op:</strong> Controleer alle details zorgvuldig voordat je een beslissing neemt.
              Bij afkeuring of verzoek tot aanpassingen is feedback verplicht.
            </div>
            <label class="bd-feedback-label">
              Feedback (optioneel bij goedkeuring, verplicht bij afkeuring/aanpassingen)
            </label>
            <textarea class="bd-feedback-input" id="bd-feedback" placeholder="Geef feedback over de stage aanvraag..."></textarea>
            <div class="bd-acties">
              <button class="bd-btn bd-btn--goedkeuren" id="bd-goedkeuren">✓ Goedkeuren</button>
              <button class="bd-btn bd-btn--aanpassingen" id="bd-aanpassingen">⚠ Aanpassingen Vragen</button>
              <button class="bd-btn bd-btn--afkeuren" id="bd-afkeuren">✗ Afkeuren</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.querySelector('#bd-terug').addEventListener('click', function(e) {
    e.preventDefault();
    import('./aanvragen.js').then(function(m) { m.renderAanvragen(); });
  });
}
