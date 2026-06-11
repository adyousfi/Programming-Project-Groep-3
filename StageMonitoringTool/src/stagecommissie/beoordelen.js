import './beoordelen.css';

function statusLabel(status) {
  const labels = {
    in_afwachting: 'In afwachting',
    goedgekeurd:   'Goedgekeurd',
    afgekeurd:     'Afgekeurd',
    aanpassingen:  'Aanpassingen nodig',
  };
  return labels[status] || status;
}

function beslissingLabel(beslissing) {
  const labels = {
    goedgekeurd:  'Goedgekeurd',
    aanpassingen: 'Aanpassingen vereist',
    afgekeurd:    'Afgekeurd',
  };
  return labels[beslissing] || beslissing;
}

function detailKaart(aanvraag, badgeStatus) {
  return `
    <div class="bd-card">
      <div class="bd-card-top">
        <div>
          <h3 class="bd-card-functie">${aanvraag.functie}</h3>
          <p class="bd-card-bedrijfnaam">${aanvraag.bedrijf.naam}</p>
        </div>
        <span class="bd-badge bd-badge--${badgeStatus}">${statusLabel(badgeStatus)}</span>
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
  `;
}

export function renderBeoordelen(aanvraag, userName = 'Stagecommissie') {
  document.querySelector('#app').innerHTML = `
    <div class="bd-page">
      <header class="bd-header">
        <h1 class="bd-header-title">Stage Monitoring Tool</h1>
        <div class="bd-header-right">
          <div class="bd-header-user">
            <span class="bd-header-naam">${userName}</span>
            <span class="bd-header-rol">Stagecommissie</span>
          </div>
          <button class="bd-header-btn" id="bd-uitloggen">Uitloggen</button>
        </div>
      </header>
      <div class="bd-content">
        <a href="#" class="bd-terug" id="bd-terug">← Terug naar dashboard</a>
        <h2 class="bd-titel">Stage Aanvraag Details</h2>

        ${detailKaart(aanvraag, aanvraag.status)}

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

  document.querySelector('#bd-uitloggen').addEventListener('click', async function() {
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

  document.querySelector('#bd-goedkeuren').addEventListener('click', async function() {
    const feedback = document.querySelector('#bd-feedback').value.trim();
    try {
      const response = await fetch(`/api/stages/${aanvraag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Goedgekeurd', feedback: feedback || null }),
      });
      if (!response.ok) throw new Error('Server fout: ' + response.status);
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message);
      return;
    }
    toonHistoriek(aanvraag, 'goedgekeurd', feedback, userName);
  });

  document.querySelector('#bd-aanpassingen').addEventListener('click', async function() {
    const feedback = document.querySelector('#bd-feedback').value.trim();
    if (!feedback) { toonFeedbackFout(); return; }
    try {
      const response = await fetch(`/api/stages/${aanvraag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Aanpassingen_vereist', feedback }),
      });
      if (!response.ok) throw new Error('Server fout: ' + response.status);
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message);
      return;
    }
    toonHistoriek(aanvraag, 'aanpassingen', feedback, userName);
  });

  document.querySelector('#bd-afkeuren').addEventListener('click', async function() {
    const feedback = document.querySelector('#bd-feedback').value.trim();
    if (!feedback) { toonFeedbackFout(); return; }
    try {
      const response = await fetch(`/api/stages/${aanvraag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Afgekeurd', feedback }),
      });
      if (!response.ok) throw new Error('Server fout: ' + response.status);
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message);
      return;
    }
    toonHistoriek(aanvraag, 'afgekeurd', feedback, userName);
  });
}

function toonFeedbackFout() {
  const input = document.querySelector('#bd-feedback');
  input.style.borderColor = '#dc2626';
  input.placeholder = 'Feedback is verplicht bij afkeuring of aanpassingen.';
  input.focus();
}

function toonHistoriek(aanvraag, beslissing, feedback, userName = 'Stagecommissie') {
  document.querySelector('#app').innerHTML = `
    <div class="bd-page">
      <header class="bd-header">
        <h1 class="bd-header-title">Stage Monitoring Tool</h1>
        <div class="bd-header-right">
          <div class="bd-header-user">
            <span class="bd-header-naam">${userName}</span>
            <span class="bd-header-rol">Stagecommissie</span>
          </div>
          <button class="bd-header-btn" id="bd-uitloggen">Uitloggen</button>
        </div>
      </header>
      <div class="bd-content">
        <a href="#" class="bd-terug" id="bd-terug2">← Terug naar dashboard</a>
        <h2 class="bd-titel">Stage Aanvraag Details</h2>

        ${detailKaart(aanvraag, beslissing)}

        <div class="bd-card">
          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Beoordelingshistoriek</h4>
            <div class="bd-historiek-box bd-historiek-box--${beslissing}">
              <p class="bd-historiek-beslissing">
                <strong>Beslissing:</strong>
                <span class="bd-historiek-label--${beslissing}">${beslissingLabel(beslissing)}</span>
              </p>
              ${feedback ? `<p class="bd-historiek-feedback-titel"><strong>Feedback van stagecommissie:</strong></p><p class="bd-historiek-feedback">${feedback}</p>` : ''}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.querySelector('#bd-terug2').addEventListener('click', function(e) {
    e.preventDefault();
    import('./aanvragen.js').then(function(m) { m.renderAanvragen(); });
  });

  document.querySelector('#bd-uitloggen').addEventListener('click', function() {
    window.location.href = '/';
  });
}

export function renderDetails(aanvraag, userName = 'Stagecommissie') {
  document.querySelector('#app').innerHTML = `
    <div class="bd-page">
      <header class="bd-header">
        <h1 class="bd-header-title">Stage Monitoring Tool</h1>
        <div class="bd-header-right">
          <div class="bd-header-user">
            <span class="bd-header-naam">${userName}</span>
            <span class="bd-header-rol">Stagecommissie</span>
          </div>
          <button class="bd-header-btn" id="bd-uitloggen">Uitloggen</button>
        </div>
      </header>
      <div class="bd-content">
        <a href="#" class="bd-terug" id="bd-terug3">← Terug naar dashboard</a>
        <h2 class="bd-titel">Stage Aanvraag Details</h2>

        ${detailKaart(aanvraag, aanvraag.status)}

        <div class="bd-card">
          <div class="bd-sectie">
            <h4 class="bd-sectie-titel">Beoordelingshistoriek</h4>
            <p class="bd-historiek-tekst">${statusLabel(aanvraag.status)} zonder feedback</p>
          </div>
        </div>

      </div>
    </div>
  `;

  document.querySelector('#bd-terug3').addEventListener('click', function(e) {
    e.preventDefault();
    import('./aanvragen.js').then(function(m) { m.renderAanvragen(); });
  });

  document.querySelector('#bd-uitloggen').addEventListener('click', function() {
    window.location.href = '/';
  });
}
