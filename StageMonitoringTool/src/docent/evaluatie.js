import './evaluatie.css';

let _userName = 'Docent';
let _currentUser = null;
let _currentStudent = null;
let _competentiesCache = null;

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#39;',
    }[c]));
}

function sidebarHtml(activePage) {
  const items = [
    { key: 'overzicht', label: 'Overzicht' },
    { key: 'stagedetails', label: 'Stagedetails' },
    { key: 'logboek', label: 'Logboek' },
    { key: 'evaluatie', label: 'Evaluatie' },
  ];

  return `
    <aside class="sm-sidebar sm-sidebar--detail">
      <div class="sm-sidebar-top">
        <div class="sm-logo">
          <span class="sm-logo-title">Stage Monitoring</span>
          <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
        </div>
        <nav class="sm-nav sm-nav--detail">
          ${items.map(i => `<a class="sm-nav-item ${i.key === activePage ? 'active' : ''}" data-page="${i.key}" href="#">${i.label}</a>`).join('')}
        </nav>
      </div>
      <div class="sm-sidebar-bottom">
        <span class="sm-user-name">${_userName}</span>
        <a class="sm-logout" href="#">Uitloggen</a>
      </div>
    </aside>
  `;
}

function evalTabsHtml(activeTab) {
  return `
    <div class="sm-eval-tabs">
      <button class="sm-eval-tab ${activeTab === 'tussentijds' ? 'active' : ''}" data-tab="tussentijds">Tussentijdse evaluatie</button>
      <button class="sm-eval-tab ${activeTab === 'finale' ? 'active' : ''}" data-tab="finale">Finale evaluatie</button>
    </div>
  `;
}

function attachBackLink() {
  document.querySelector('#sm-back-evaluatie')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (_currentStudent && _currentUser) {
      import('./student-detail.js').then((m) => {
        m.renderStudentDetail(_currentStudent, _currentUser);
      });
    } else {
      window.location.href = '#';
    }
  });
}

function attachTabSwitch(app, stagiair) {
  document.querySelectorAll('.sm-eval-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      window.location.hash = `#docent-evaluatie-${tabName}`;
      renderEvaluatieTab(app, stagiair, tabName);
    });
  });
}

function attachNav(app, stagiair) {
  document.querySelectorAll('.sm-nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;

      if (page === 'evaluatie') {
        renderEvaluatieTab(app, stagiair, 'tussentijds');
      } else if (page === 'overzicht' || page === 'stagedetails' || page === 'logboek') {
        if (_currentStudent && _currentUser) {
          import('./student-detail.js').then((m) => {
            m.renderStudentDetail(_currentStudent, _currentUser, page);
          });
        }
      }
    });
  });
}

// ---------------------------------------------------------------------------
// API helpers
// TODO: vervang deze twee functies door echte calls naar de backend.
// ---------------------------------------------------------------------------

// Controleert of er voor deze stage al een evaluatie van dit type (tussentijds/
// finale) is ingepland, d.w.z. of er al per-competentie instanties bestaan.
async function fetchEvaluatieStatus(stageId, type_evaluatie) {
  const res = await fetch(
    `/api/evaluaties/status?stage_id=${encodeURIComponent(stageId)}&type_evaluatie=${encodeURIComponent(type_evaluatie)}`,
    { credentials: 'include' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch evaluatie status: ${res.status}`);
  }

  return res.json();
}

// Maakt voor élke huidige competentie een afzonderlijke evaluatie-instantie
// aan, gekoppeld aan deze stage en dit type (tussentijds/finale).
async function registreerEvaluatie(stageId, type_evaluatie, docentId) {
  const res = await fetch('/api/evaluaties/create-per-competentie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ stage_id: stageId, type_evaluatie, docent_id: docentId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to register evaluaties: ${res.status} ${text}`);
  }

  return res.json();
}

async function fetchCompetentiesMetRubrieken() {
  if (_competentiesCache) return _competentiesCache;
  const res = await fetch('/api/competenties/all-met-rubrieken', { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch competenties: ${res.status}`);
  const json = await res.json();
  _competentiesCache = json.data;
  return _competentiesCache;
}


// ---------------------------------------------------------------------------
// Scherm A: nog geen evaluatie ingepland -> registratiescherm
// ---------------------------------------------------------------------------
function renderEvaluatieRegistreerScreen(app, stagiair, activeTab) {
  const isFinale = activeTab === 'finale';
  const titel = isFinale ? 'Finale evaluatie' : 'Tussentijdse evaluatie';
  const knopLabel = isFinale ? 'Finale evaluatie registreren' : 'Tussentijdse evaluatie registreren';

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('evaluatie')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div>
            <h1 class="sm-detail-title">Evaluatie</h1>
            <p class="sm-detail-subtitle">Bekijk studentevaluaties en geef feedback</p>
          </div>
          <a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
        </div>

        ${evalTabsHtml(activeTab)}

        <div class="sm-eval-block">
          <div class="sm-eval-block-header">
            <h3>${titel}</h3>
            <p>Bekijk de inbreng van student en mentor. Als docent registreer je hier de ${isFinale ? 'finale' : 'tussentijdse'} evaluatie.</p>
          </div>

          <div class="sm-eval-actions">
            <button id="sm-eval-registreer" class="sm-button">${knopLabel}</button>
          </div>
          <p id="sm-eval-registreer-message" class="sm-eval-save-message hidden"></p>
        </div>
      </main>
    </div>
  `;

  attachBackLink();
  attachNav(app, stagiair);
  attachTabSwitch(app, stagiair);

  const btn = document.querySelector('#sm-eval-registreer');
  const msg = document.querySelector('#sm-eval-registreer-message');

  btn?.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Registreren...';

    try {
      const result = await registreerEvaluatie(stagiair.stage_id, activeTab, _currentUser?.user_id);
      // Voor elke competentie bestaat nu een instantie -> meteen het
      // scoringsscherm tonen, zonder opnieuw te moeten ophalen.
      await renderEvaluatiePage(app, stagiair, activeTab, result.data);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = knopLabel;
      if (msg) {
        msg.textContent = 'Registreren mislukt, probeer opnieuw.';
        msg.classList.remove('hidden');
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Scherm B: evaluatie bestaat al -> scoringsscherm per competentie
// ---------------------------------------------------------------------------
async function renderEvaluatiePage(app, stagiair, activeTab = 'tussentijds', evaluatieData = [], alreadySubmitted = false) {
  const scores = [1, 2, 3, 4, 5];

  // We moeten per competentie de rubriek_id kunnen wegschrijven bij indienen.
  // In evaluatieData zit rubriek_id (via getEvaluatieStatus).
  const rubriekIdByCode = Object.fromEntries(
    (evaluatieData || []).map((e) => [e.competentie_code, e.rubriek_id ?? null])
  );

  const competenties = await fetchCompetentiesMetRubrieken();

  const dataByCode = Object.fromEntries(
    evaluatieData.map((e) => [e.competentie_code, e])
  );

  const descriptions =
    activeTab === 'finale'
      ? {
          1: '{c} is op het einde van de stage onvoldoende beheerst; het eindniveau wordt niet gehaald.',
          2: '{c} blijft net onder het verwachte eindniveau; er zijn nog duidelijke tekortkomingen.',
          3: '{c} wordt op eindniveau voldoende beheerst, maar met beperkte zelfstandigheid.',
          4: '{c} wordt op eindniveau goed beheerst, met zelfstandig en consistent werk.',
          5: '{c} wordt op eindniveau uitstekend beheerst, met initiatief, reflectie en meerwaarde voor het team.',
        }
      : {
          1: '{c} is niet of onvoldoende aangetoond binnen de verwachtingen van de stage.',
          2: '{c} is nipt aanwezig; belangrijke aspecten ontbreken of zijn nog onzeker.',
          3: '{c} wordt voldoende uitgevoerd, maar nog niet volledig zelfstandig of consistent.',
          4: '{c} wordt correct uitgevoerd, met af en toe lichte begeleiding of bijsturing nodig.',
          5: '{c} wordt zelfstandig en boven de verwachtingen uitgevoerd, met initiatief en reflectie.',
        };

  const pageTitle = 'Evaluatie';
  const pageSubtitle = 'Evalueer de stagiair op basis van competenties';

  const blockTitle = activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking';
  const blockDesc = activeTab === 'finale'
    ? 'Geef per competentie een finale score en feedback.'
    : 'Geef per competentie een score en feedback.';

  // Toon totaalscore (0..100) bij laden, gebaseerd op bestaande docent-scores
  const existingScores = evaluatieData
    .map((e) => (e?.score ?? null))
    .filter((s) => s !== null && s !== undefined);
  const uniekeCompetentieN = Array.from(
    new Set(
      evaluatieData
        .map((e) => e?.competentie_id ?? null)
        .filter((id) => id !== null && id !== undefined)
    )
  ).length;

  const initTotalPercentage = (() => {
    const N = uniekeCompetentieN;
    if (!N) return null;
    const sumScores = evaluatieData.reduce((acc, e) => {
      const s = e?.score;
      if (s === null || s === undefined) return acc;
      return acc + (Number(s) / 5) * 20;
    }, 0);
    const total = sumScores / N;
    return Math.round(total * 10) / 10;
  })();

  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('evaluatie')}
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <div>
            <h1 class="sm-detail-title">${pageTitle}</h1>
            <p class="sm-detail-subtitle">${pageSubtitle}</p>
          </div>
          <a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
        </div>

        ${evalTabsHtml(activeTab)}

        <div class="sm-eval-block" style="display:grid;grid-template-columns: 1fr 320px;gap:16px;align-items:start;">
          <div>
          <div class="sm-eval-block-header">
              <h3>${blockTitle}</h3>
              <p>${blockDesc}</p>
              <p class="sm-eval-datum" style="margin-top:6px;color:#6b7280;">
                Datum evaluatie: <strong>${new Date().toLocaleDateString('nl-BE')}</strong>
              </p>
            </div>

            <div id="sm-eval-result-column" style="position:sticky;top:16px;border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#fff;">
              <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Uitkomst</div>
              <div style="font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111827;">
                ${initTotalPercentage !== null ? `${initTotalPercentage.toFixed(1)}/20` : '--'}
              </div>
              <div style="font-size:13px;color:#6b7280;margin-top:6px;">
                Gebaseerd op docent-scores per competentie
              </div>
            </div>

            ${competenties.map((comp) => {
              const bestaande = dataByCode[comp.code];
              const rubrieken = comp.Rubrieks || [];
              return `
            <div class="sm-eval-competentie" data-competentie-id="${comp.competentie_id}" data-competentie-code="${comp.code}">
              <h3 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">${escapeHtml(comp.titel)}</h3>
              <p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(comp.omschrijving)}</p>

              <div class="sm-eval-feedback-grid">
                <div class="sm-eval-feedback-card sm-eval-feedback-card--student">
                  <span class="sm-eval-feedback-card-label">STUDENT</span>
                  ${bestaande?.feedback_student || bestaande?.score_student != null
                    ? bestaande?.feedback_student
                      ? `<p class="sm-eval-feedback-card-text">${escapeHtml(bestaande.feedback_student)}</p>`
                      : ''
                    : `<p class="sm-eval-feedback-card-pending">De student heeft nog geen evaluatie ingevuld.</p>`
                  }
                  <span class="sm-eval-feedback-card-score">${bestaande?.score_student != null ? `Score: ${bestaande.score_student} / 5` : 'Score: --'}</span>
                </div>
                <div class="sm-eval-feedback-card sm-eval-feedback-card--mentor">
                  <span class="sm-eval-feedback-card-label sm-eval-feedback-card-label--mentor">MENTOR</span>
                  ${bestaande?.feedback_mentor || bestaande?.score_mentor != null
                    ? bestaande?.feedback_mentor
                      ? `<p class="sm-eval-feedback-card-text">${escapeHtml(bestaande.feedback_mentor)}</p>`
                      : ''
                    : `<p class="sm-eval-feedback-card-pending">De stagementor heeft nog geen evaluatie ingevuld.</p>`
                  }
                  <span class="sm-eval-feedback-card-score sm-eval-feedback-card-score--mentor">${bestaande?.score_mentor != null ? `Score: ${bestaande.score_mentor} / 5` : 'Score: --'}</span>
                </div>
              </div>

              <div>
                <span class="sm-score-title">Hoe scoor je deze competentie? Klik op een score (1 = laag, 5 = hoog)</span>
                <div class="sm-eval-score-cards">
                  ${scores.map((score) => `
                    <button type="button" class="sm-score-card sm-score-card--${score} ${bestaande?.score === score ? 'selected' : ''}" data-score="${score}" data-competentie="${comp.competentie_id}" data-competentie-code="${comp.code}">
                      <span class="sm-score-card-number">${score}</span>
                      <span class="sm-score-card-text">${descriptions[score].replace('{c}', escapeHtml(comp.titel))}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="sm-eval-mentor-panel">
                <h4>Feedback (docent)</h4>
                <label class="sm-eval-feedback-label" for="feedback-${comp.competentie_id}">Feedback</label>
                <textarea id="feedback-${comp.competentie_id}" class="sm-eval-feedback" placeholder="Beschrijf je feedback over de vorderingen van de student...">${escapeHtml(bestaande?.feedback_docent ?? '')}</textarea>
              </div>
            </div>
          `;
          }).join('')}

          <div class="sm-eval-actions">
            <button id="sm-eval-save" class="sm-button">Beoordeling Opslaan</button>
            <button id="sm-eval-submit" class="sm-button" style="margin-left:10px;">Indienen</button>
          </div>
          <p id="sm-eval-save-message" class="sm-eval-save-message hidden">Evaluatie opgeslagen.</p>
        </div>
      </main>
    </div>
  `;

  attachBackLink();
  attachNav(app, stagiair);
  attachTabSwitch(app, stagiair);

  // Selecteer score UI
  document.querySelectorAll('.sm-score-card').forEach((card) => {
    card.addEventListener('click', () => {
      const container = card.closest('.sm-eval-score-cards');
      if (!container) return;
      container.querySelectorAll('.sm-score-card').forEach((b) => b.classList.remove('selected'));
      card.classList.add('selected');
      // Remove error border when score is selected
      const comp = card.closest('.sm-eval-competentie');
      if (comp) comp.classList.remove('sm-eval-competentie--error');
      const msg = document.querySelector('#sm-eval-save-message');
      if (msg) msg.classList.remove('sm-eval-save-message--error');
    });
  });

  // Grey out everything if already submitted
  if (alreadySubmitted) {
    document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
    document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
    const saveBtn = document.querySelector('#sm-eval-save');
    const submitBtn = document.querySelector('#sm-eval-submit');
    if (saveBtn) saveBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    const msg = document.querySelector('#sm-eval-save-message');
    if (msg) {
      msg.textContent = 'De evaluatie is reeds ingediend en kan niet meer worden gewijzigd.';
      msg.classList.remove('hidden');
    }
  }

  // Save UI
  async function saveDocentEvaluatie(isSubmit = false) {
    const saveBtn = document.querySelector('#sm-eval-save');
    const submitBtn = document.querySelector('#sm-eval-submit');

    // Validation: check all competenties have a score selected
    if (isSubmit) {
      let allFilled = true;
      document.querySelectorAll('.sm-eval-competentie').forEach((el) => {
        const hasScore = el.querySelector('.sm-score-card.selected');
        if (!hasScore) {
          el.classList.add('sm-eval-competentie--error');
          allFilled = false;
        }
      });
      if (!allFilled) {
        const msg = document.querySelector('#sm-eval-save-message');
        if (msg) { msg.textContent = 'Vul alle competenties in voordat je kunt indienen.'; msg.classList.remove('hidden'); msg.classList.add('sm-eval-save-message--error'); }
        saveBtn && (saveBtn.disabled = false);
        submitBtn && (submitBtn.disabled = false);
        return;
      }
    }

    saveBtn && (saveBtn.disabled = true);
    submitBtn && (submitBtn.disabled = true);

    // Per competentie de geselecteerde score + feedback bij elkaar rapen, zodat
    // dit per instantie (= per competentie) kan worden opgeslagen.
    const updates = Array.from(document.querySelectorAll('.sm-eval-competentie')).map((el) => {
      const code = el.dataset.competentieCode;
      const containerRubriekId = el.dataset.rubriek_id ?? null;

      const selected = el.querySelector('.sm-score-card.selected');
      const feedback = el.querySelector('.sm-eval-feedback')?.value ?? '';

      // Enkel docentscore in dit scherm. student/mentor worden via andere UI's ingevuld.
      return {
        competentie_code: code,
        // docent bepaalt rubriek_id via backend mapping op basis van competentie_id + score
        score: selected ? Number(selected.dataset.score) : null,
        feedback,
        // zorgt ervoor dat backend ook meteen de correcte rubriek_id kan wegschrijven
        rubriek_id: containerRubriekId ? Number(containerRubriekId) : null,
      };
    });

    try {
      const res = await fetch(`/api/evaluaties/${stagiair.stage_id}/per-competentie`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          stage_id: stagiair.stage_id,
          type_evaluatie: activeTab,
          docent_id: _currentUser?.user_id ?? _currentUser?.id ?? _currentUser?.docent_id ?? null,
          updates,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Save failed: ${res.status} ${text}`);
      }

      const json = await res.json().catch(() => ({}));

      const resultColumn = document.querySelector('#sm-eval-result-column');
      if (resultColumn) {
        const total = json?.totalPercentage;
        const valueEl = resultColumn.querySelector('div[style*="font-size:30px"]');
        if (valueEl) {
          if (total !== null && total !== undefined && !Number.isNaN(Number(total))) {
            valueEl.textContent = `${(Number(total) / 5).toFixed(1)}/20`;
          } else {
            valueEl.textContent = '--';
          }
        }
      }

      const msg = document.querySelector('#sm-eval-save-message');
      if (isSubmit) {
        if (msg) {
          const total = json?.totalPercentage;
          if (total !== null && total !== undefined && !Number.isNaN(Number(total))) {
            msg.textContent = `Evaluatie succesvol ingediend. Totaalscore: ${(Number(total) / 5).toFixed(1)}/20`;
          } else {
            msg.textContent = 'Evaluatie succesvol ingediend.';
          }
          msg.classList.remove('hidden');
        }
        // Disable all inputs after submission
        document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
        document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
        if (submitBtn) submitBtn.disabled = true;
        if (saveBtn) saveBtn.disabled = true;
        // Navigate back to overzicht after short delay
        setTimeout(() => {
          if (_currentStudent && _currentUser) {
            import('./student-detail.js').then((m) => { m.renderStudentDetail(_currentStudent, _currentUser); });
          }
        }, 1500);
      } else {
        if (msg) {
          const total = json?.totalPercentage;
          if (total !== null && total !== undefined && !Number.isNaN(Number(total))) {
            msg.textContent = `Evaluatie opgeslagen. Totaalscore: ${(Number(total) / 5).toFixed(1)}/20`;
          } else {
            msg.textContent = 'Evaluatie opgeslagen.';
          }
          msg.classList.remove('hidden');
        }
      }

      console.log('Saved evaluatie', { totalPercentage: json?.totalPercentage, isSubmit });
    } catch (e) {
      console.error(e);
      const msg = document.querySelector('#sm-eval-save-message');
      if (msg) {
        msg.textContent = isSubmit ? 'Indienen mislukt, probeer opnieuw.' : 'Opslaan mislukt, probeer opnieuw.';
        msg.classList.remove('hidden');
      }
    } finally {
      if (!isSubmit) {
        saveBtn && (saveBtn.disabled = false);
        submitBtn && (submitBtn.disabled = false);
      }
    }
  }

  document.querySelector('#sm-eval-save')?.addEventListener('click', () => saveDocentEvaluatie(false));
  document.querySelector('#sm-eval-submit')?.addEventListener('click', () => saveDocentEvaluatie(true));
}


// ---------------------------------------------------------------------------
// Orchestratie: bepaalt welk scherm getoond wordt voor het gekozen tabblad
// (tussentijds/finale) op basis van of er al een evaluatie is ingepland.
// ---------------------------------------------------------------------------
async function renderEvaluatieTab(app, stagiair, activeTab = 'tussentijds') {
  app.innerHTML = `
    <div class="sm-layout">
      ${sidebarHtml('evaluatie')}
      <main class="sm-main sm-main--detail">
        <p style="padding:24px;color:#6b7280;">Evaluatie laden...</p>
      </main>
    </div>
  `;

  try {
    const status = await fetchEvaluatieStatus(stagiair.stage_id, activeTab);

    if (!status.bestaat) {
      renderEvaluatieRegistreerScreen(app, stagiair, activeTab);
    } else {
      const alreadySubmitted = status.evaluaties.length > 0
        && status.evaluaties.every((e) => e.score_docent != null);
      await renderEvaluatiePage(app, stagiair, activeTab, status.evaluaties, alreadySubmitted);
    }

  } catch (err) {
    console.error(err);
    app.innerHTML = `
      <div class="sm-layout">
        ${sidebarHtml('evaluatie')}
        <main class="sm-main sm-main--detail">
          <div class="sm-detail-top">
            <div>
              <h1 class="sm-detail-title">Evaluatie</h1>
              <p class="sm-detail-subtitle">Fout bij het laden</p>
            </div>
            <a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
          </div>
          <div class="sm-eval-block">
            <div class="sm-eval-block-header">
              <h3>Verbinding mislukt</h3>
              <p>Kan de evaluatie-informatie niet ophalen. Controleer of de server actief is en probeer opnieuw.</p>
            </div>
            <div class="sm-eval-actions">
              <button id="sm-eval-retry" class="sm-button">Opnieuw proberen</button>
            </div>
          </div>
        </main>
      </div>
    `;
    attachBackLink();
    attachNav(app, stagiair);
    document.querySelector('#sm-eval-retry')?.addEventListener('click', () => {
      renderEvaluatieTab(app, stagiair, activeTab);
    });
  }
}




export async function renderEvaluatieDocent(app, user, student) {
  _currentUser = user;
  _currentStudent = student;

  _userName = user && user.last_name
    ? `${user.last_name.toUpperCase()} ${user.first_name}`
    : user?.first_name || 'Docent';

  const stagiair = {
    naam: student?.naam || 'Stagiair',
    email: student?.email || '',
    stage_id: student?.id || null,
  };

  const heeftStage = Boolean(stagiair.stage_id);

  if (!heeftStage) {
    app.innerHTML = `
      <div class="sm-layout">
        ${sidebarHtml('evaluatie')}
        <main class="sm-main sm-main--detail">
          <div class="sm-detail-top">
            <div>
              <h1 class="sm-detail-title">Evaluatie</h1>
              <p class="sm-detail-subtitle">Geen stage gevonden</p>
            </div>
            <a id="sm-back-evaluatie" class="sm-detail-back" href="#">← Terug naar stagiairs</a>
          </div>

          <div class="sm-eval-block">
            <div class="sm-eval-block-header">
              <h3>Geen stage gevonden</h3>
              <p>Er is geen stage gekoppeld aan deze student. Keer terug naar het overzicht.</p>
            </div>
          </div>
        </main>
      </div>
    `;
    attachBackLink();
    attachNav(app, stagiair);
    return;
  }

  renderEvaluatieTab(app, stagiair, 'tussentijds');
}