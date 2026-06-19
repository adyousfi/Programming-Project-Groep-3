import './evaluatie.css';

let _userName = 'Student';
let _currentUser = null;
let _stageData = null;
let _competentiesCache = null;
let _anyNewEval = false;

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

function sidebarHtml() {
  return `
    <aside class="evaluatie-sidebar">
        <div class="sidebar-top">
            <div class="sidebar-logo">
                <span class="sidebar-logo-title">Stage Monitoring</span>
                <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
            </div>
            <nav class="sidebar-nav">
                <a href="?role=goedgekeurd_student" class="sidebar-nav-item">Overzicht</a>
                <a href="?role=stagedetails" class="sidebar-nav-item">Stagedetails</a>
                <a href="?role=documenten" class="sidebar-nav-item">Documenten</a>
                <a href="?role=logboek" class="sidebar-nav-item">Logboek</a>
                <a href="?role=evaluatie" class="sidebar-nav-item active">Evaluatie${_anyNewEval ? ' <span class="sidebar-badge">Nieuw</span>' : ''}</a>
            </nav>
        </div>
        <div class="sidebar-bottom">
            <span class="sidebar-user-name">${_userName}</span>
            <a href="/" class="sidebar-logout">Uitloggen</a>
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

function attachTabSwitch(app, stagiair) {
  document.querySelectorAll('.sm-eval-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      renderEvaluatieTab(app, stagiair, tab.dataset.tab);
    });
  });
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function fetchEvaluatieStatus(stageId, type_evaluatie) {
  const res = await fetch(
    `/api/evaluaties/status?stage_id=${encodeURIComponent(stageId)}&type_evaluatie=${encodeURIComponent(type_evaluatie)}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error(`Failed to fetch evaluatie status: ${res.status}`);
  return res.json();
}

async function registreerEvaluatie(stageId, type_evaluatie) {
  const res = await fetch('/api/evaluaties/create-per-competentie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ stage_id: stageId, type_evaluatie }),
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
// Scherm A: nog geen evaluatie ingepland -> wacht op docent
// ---------------------------------------------------------------------------
function renderWachtOpDocent(app, stagiair, activeTab) {
  const isFinale = activeTab === 'finale';
  const titel = isFinale ? 'Finale evaluatie' : 'Tussentijdse evaluatie';

  app.innerHTML = `
    <div class="evaluatie-layout">
      ${sidebarHtml()}
      <main class="evaluatie-main">
        <div class="sm-detail-top">
          <div>
            <h1 class="sm-detail-title">Evaluatie</h1>
            <p class="sm-detail-subtitle">Geef je evaluatie per competentie</p>
          </div>
        </div>

        ${evalTabsHtml(activeTab)}

        <div class="sm-eval-block">
          <div class="sm-eval-block-header">
            <h3>${titel}</h3>
            <p>Wacht tot de docent de evaluatie aanmaakt. Je ontvangt een melding wanneer je je evaluatie kunt invullen.</p>
          </div>
        </div>
      </main>
    </div>
  `;

  attachTabSwitch(app, stagiair);
}

// ---------------------------------------------------------------------------
// Scherm B: evaluatie bestaat al -> scoringsscherm per competentie
// ---------------------------------------------------------------------------
async function renderEvaluatiePage(app, stagiair, activeTab = 'tussentijds', evaluatieData = [], studentSubmitted = false, docentSubmitted = false) {
  const scores = [1, 2, 3, 4, 5];

  const competenties = await fetchCompetentiesMetRubrieken();

  const dataByCode = Object.fromEntries(
    evaluatieData.map((e) => [e.competentie_code, e])
  );

  const blockTitle = activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking';
  const blockDesc = activeTab === 'finale'
    ? 'Geef per competentie een finale score en feedback.'
    : 'Geef per competentie een score en feedback.';

  // Decide which score/feedback to show:
  // - before docent submitted: show student values
  // - after docent submitted: show docent values (must not show student's own evaluation)
  const isDocentView = Boolean(docentSubmitted);
  const scoreKey = isDocentView ? 'score_docent' : 'score_student';
  const feedbackKey = isDocentView ? 'feedback_docent' : 'feedback_student';

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
      const s = e?.[scoreKey];
      if (s === null || s === undefined) return acc;
      return acc + (Number(s) / 5) * 20;
    }, 0);
    return Math.round((sumScores / N) * 10) / 10;
  })();

  app.innerHTML = `
    <div class="evaluatie-layout">
      ${sidebarHtml()}
      <main class="evaluatie-main">
        <div class="sm-detail-top">
          <div>
            <h1 class="sm-detail-title">Evaluatie</h1>
            <p class="sm-detail-subtitle">Geef je evaluatie per competentie</p>
          </div>
        </div>

        ${evalTabsHtml(activeTab)}

        <div class="sm-eval-block">
          <div class="sm-eval-block-header">
            <h3>${blockTitle}</h3>
            <p>${blockDesc}</p>
            <p class="sm-eval-datum" style="margin-top:6px;color:#6b7280;">
              Datum evaluatie: <strong>${new Date().toLocaleDateString('nl-BE')}</strong>
            </p>
            ${docentSubmitted ? `
            <div style="margin-top:12px;padding:18px 24px;background:#eff6ff;border:2px solid #3b82f6;border-radius:10px;font-size:20px;font-weight:800;color:#1e40af;text-align:center;letter-spacing:-0.01em;">
              &#128203; Dit is het resultaat van je ${activeTab === 'finale' ? 'finale' : 'tussentijdse'} evaluatie
            </div>` : ''}
          </div>

          <div id="sm-eval-result-column" style="border:1px solid #e5e7eb;border-radius:12px;padding:14px;background:#fff;margin-bottom:20px;">
            <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Uitkomst</div>
            <div style="font-size:30px;font-weight:800;letter-spacing:-0.02em;color:#111827;">
              ${initTotalPercentage !== null ? `${initTotalPercentage.toFixed(1)}/20` : '--'}
            </div>
            <div style="font-size:13px;color:#6b7280;margin-top:6px;">
              Gebaseerd op ${isDocentView ? 'docent-scores' : 'je scores'} per competentie
            </div>
          </div>

            ${competenties.map((comp) => {
              const bestaande = dataByCode[comp.code];
              const rubriekMap = Object.fromEntries(
                (comp.Rubrieks || []).map(r => [r.score, escapeHtml(r.beschrijving)])
              );
              return `
            <div class="sm-eval-competentie" data-competentie-id="${comp.competentie_id}" data-competentie-code="${comp.code}">
              <h3 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">${escapeHtml(comp.titel)}</h3>
              <p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(comp.omschrijving)}</p>

              <div>
                <span class="sm-score-title">Hoe scoor je deze competentie? Klik op een score (1 = laag, 5 = hoog)</span>
                <div class="sm-eval-score-cards">
                  ${scores.map((score) => `
                    <button type="button" class="sm-score-card sm-score-card--${score} ${bestaande?.[scoreKey] === score ? 'selected' : ''}" data-score="${score}" data-competentie="${comp.competentie_id}" data-competentie-code="${comp.code}">
                      <span class="sm-score-card-number">${score}</span>
                      <span class="sm-score-card-text">${rubriekMap[score] || ''}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="sm-eval-mentor-panel">
                <h4>Feedback (${isDocentView ? 'docent' : 'student'})</h4>
                <label class="sm-eval-feedback-label" for="feedback-${comp.competentie_id}">Feedback</label>
                <textarea id="feedback-${comp.competentie_id}" class="sm-eval-feedback" placeholder="Beschrijf je feedback over deze competentie...">${escapeHtml(bestaande?.[feedbackKey] ?? '')}</textarea>
              </div>
            </div>
          `;
            }).join('')}

          ${!studentSubmitted ? `
          <div class="sm-eval-actions">
            <button id="sm-eval-save" class="sm-button">Beoordeling Opslaan</button>
            <button id="sm-eval-submit" class="sm-button" style="margin-left:10px;">Indienen</button>
          </div>` : ''}
          <p id="sm-eval-save-message" class="sm-eval-save-message hidden">Evaluatie opgeslagen.</p>
        </div>
      </main>
    </div>
  `;

  attachTabSwitch(app, stagiair);

  // Grey out everything if student has submitted
  if (studentSubmitted) {
    document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
    document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
    const saveBtn = document.querySelector('#sm-eval-save');
    const submitBtn = document.querySelector('#sm-eval-submit');
    if (saveBtn) saveBtn.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    const msg = document.querySelector('#sm-eval-save-message');
    if (msg) {
      msg.textContent = 'Je evaluatie is reeds ingediend en kan niet meer worden gewijzigd.';
      msg.classList.remove('hidden');
    }
  }

  // Score card selection
  document.querySelectorAll('.sm-score-card').forEach((card) => {
    card.addEventListener('click', () => {
      const container = card.closest('.sm-eval-score-cards');
      if (!container) return;
      container.querySelectorAll('.sm-score-card').forEach((b) => b.classList.remove('selected'));
      card.classList.add('selected');
      const comp = card.closest('.sm-eval-competentie');
      if (comp) comp.classList.remove('sm-eval-competentie--error');
      const msg = document.querySelector('#sm-eval-save-message');
      if (msg) msg.classList.remove('sm-eval-save-message--error');
    });
  });

  // Save / Submit
  async function saveStudentEvaluatie(isSubmit = false) {
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

    const updates = Array.from(document.querySelectorAll('.sm-eval-competentie')).map((el) => {
      const code = el.dataset.competentieCode;
      const selected = el.querySelector('.sm-score-card.selected');
      const feedback = el.querySelector('.sm-eval-feedback')?.value ?? '';

      return {
        competentie_code: code,
        score: null,
        feedback: null,
        score_student: selected ? Number(selected.dataset.score) : null,
        feedback_student: feedback || null,
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
          updates,
          ingediend_role: isSubmit ? 'student' : undefined,
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
          msg.textContent = 'Evaluatie succesvol ingediend.';
          msg.classList.remove('hidden');
        }
        document.querySelectorAll('.sm-score-card').forEach((b) => { b.disabled = true; });
        document.querySelectorAll('.sm-eval-feedback').forEach((t) => { t.disabled = true; });
        if (submitBtn) submitBtn.disabled = true;
        if (saveBtn) saveBtn.disabled = true;
        // Navigate back to overzicht after short delay
        setTimeout(() => { window.location.href = '/goedgekeurd-student'; }, 1500);
      } else {
        if (msg) {
          msg.textContent = 'Evaluatie opgeslagen.';
          msg.classList.remove('hidden');
        }
      }

      console.log('Saved student evaluatie', { totalPercentage: json?.totalPercentage, isSubmit });
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

  document.querySelector('#sm-eval-save')?.addEventListener('click', () => saveStudentEvaluatie(false));
  document.querySelector('#sm-eval-submit')?.addEventListener('click', () => saveStudentEvaluatie(true));
}

// ---------------------------------------------------------------------------
// Orchestratie
// ---------------------------------------------------------------------------
async function renderEvaluatieTab(app, stagiair, activeTab = 'tussentijds') {
  app.innerHTML = `
    <div class="evaluatie-layout">
      ${sidebarHtml()}
      <main class="evaluatie-main">
        <p style="padding:24px;color:#6b7280;">Evaluatie laden...</p>
      </main>
    </div>
  `;

  try {
    const status = await fetchEvaluatieStatus(stagiair.stage_id, activeTab);

    if (!status.bestaat) {
      renderWachtOpDocent(app, stagiair, activeTab);
    } else {
      const isDoorDocent = status.evaluaties.some((e) => e.docent_id != null);
      if (isDoorDocent) {
        const studentSubmitted = status.evaluaties.length > 0
          && status.evaluaties.every((e) => e.ingediend_student);
        const docentSubmitted = status.evaluaties.length > 0
          && status.evaluaties.every((e) => e.ingediend_docent);
        await renderEvaluatiePage(app, stagiair, activeTab, status.evaluaties, studentSubmitted, docentSubmitted);
      } else {
        renderWachtOpDocent(app, stagiair, activeTab);
      }
    }

  } catch (err) {
    console.error(err);
    app.innerHTML = `
      <div class="evaluatie-layout">
        ${sidebarHtml()}
        <main class="evaluatie-main">
          <div class="sm-detail-top">
            <div>
              <h1 class="sm-detail-title">Evaluatie</h1>
              <p class="sm-detail-subtitle">Fout bij het laden</p>
            </div>
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
    document.querySelector('#sm-eval-retry')?.addEventListener('click', () => {
      renderEvaluatieTab(app, stagiair, activeTab);
    });
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export async function renderEvaluatieStudent(app, user, stageData) {
  _currentUser = user;
  _stageData = stageData;

  _userName = user && user.last_name
    ? `${user.last_name.toUpperCase()} ${user.first_name}`
    : user?.first_name || 'Student';

  const stagiair = {
    naam: user?.first_name || 'Student',
    stage_id: stageData?.id || null,
  };

  _anyNewEval = false;
  if (stagiair.stage_id) {
    try {
      const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${stagiair.stage_id}`, { credentials: 'include' });
      const evalData = await evalRes.json();
      const evalAvailable = evalData.bestaatDoorDocent === true;
      let studentSubmitted = false;
      let docentSubmitted = false;
      if (evalAvailable) {
        const statusRes = await fetch(`/api/evaluaties/status?stage_id=${stagiair.stage_id}&type_evaluatie=tussentijds`, { credentials: 'include' });
        const statusData = await statusRes.json();
        studentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
          && statusData.evaluaties.every((e) => e.ingediend_student);
        docentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
          && statusData.evaluaties.every((e) => e.ingediend_docent);
      }
      let finaleAvailable = false;
      let finaleStudentSubmitted = false;
      let finaleDocentSubmitted = false;
      const finaleRes = await fetch(`/api/evaluaties/status?stage_id=${stagiair.stage_id}&type_evaluatie=finale`, { credentials: 'include' });
      const finaleStatusData = await finaleRes.json();
      finaleAvailable = finaleStatusData.bestaat === true
        && finaleStatusData.evaluaties && finaleStatusData.evaluaties.length > 0
        && finaleStatusData.evaluaties.some((e) => e.docent_id != null);
      if (finaleAvailable) {
        finaleStudentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_student);
        finaleDocentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_docent);
      }
      _anyNewEval = (evalAvailable && (!studentSubmitted || docentSubmitted))
        || (finaleAvailable && (!finaleStudentSubmitted || finaleDocentSubmitted));
    } catch {}
  }

  if (!stagiair.stage_id) {
    app.innerHTML = `
      <div class="evaluatie-layout">
        ${sidebarHtml()}
        <main class="evaluatie-main">
          <div class="sm-detail-top">
            <div>
              <h1 class="sm-detail-title">Evaluatie</h1>
              <p class="sm-detail-subtitle">Geen stage gevonden</p>
            </div>
          </div>
          <div class="sm-eval-block">
            <div class="sm-eval-block-header">
              <h3>Geen stage gevonden</h3>
              <p>Er is geen stage gekoppeld aan je account. Keer terug naar het overzicht.</p>
            </div>
          </div>
        </main>
      </div>
    `;
    return;
  }

  renderEvaluatieTab(app, stagiair, 'tussentijds');
}
