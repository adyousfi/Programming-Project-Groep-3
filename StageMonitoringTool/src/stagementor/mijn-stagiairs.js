import './mijn-stagiairs.css';

const stagiairs = [
  {
    naam: 'Jan Janssens',
    functie: 'Frontend Developer',
    email: 'jan.janssens@student.ehb.be',
    bedrijf: 'TechCorp Belgium',
    bedrijfFunctie: 'Frontend Developer',
    start: '3 feb',
    einde: '30 mei',
    totalWeeks: 16,
    currentWeek: 2,
    badges: [
      {type: 'warning', label: '2 logboeken te controleren'},
      {type: 'danger', label: 'Handtekening vereist'},
    ],
  },
  {
    naam: 'Sarah Vermeulen',
    functie: 'UX Designer',
    email: 'sarah.vermeulen@student.ehb.be',
    bedrijf: 'DesignHub',
    bedrijfFunctie: 'UX Designer',
    start: '1 mrt',
    einde: '30 jun',
    totalWeeks: 17,
    currentWeek: 5,
    badges: [],
  },
];

const competenties = [
  {
    key: 'planningsproces',
    title: 'Beheersing planningsproces',
    description: 'De student kan zelfstandig een planning opstellen en opvolgen.',
  },
  {
    key: 'it-oplossingen',
    title: 'Ontwerpen IT-oplossingen',
    description: 'De student kan IT-oplossingen ontwerpen op basis van een probleemanalyse.',
  },
  {
    key: 'digitale-producten',
    title: 'Implementatie digitale producten',
    description: 'De student kan digitale producten bouwen en implementeren.',
  },
  {
    key: 'communicatie',
    title: 'Helder en transparant communiceren',
    description: 'De student communiceert professioneel met stakeholders.',
  },
  {
    key: 'persoonlijke-ontwikkeling',
    title: 'Persoonlijke ontwikkeling',
    description: 'De student werkt actief aan zijn persoonlijke en professionele groei.',
  },
];

// storage helpers (module scope)
function smIsWeekAfgevinkt(email, week) {
  try { return localStorage.getItem(`sm_afgevinkt_${email}_${week}`) === '1'; } catch (e) { return false; }
}

function smSetWeekAfgevinkt(email, week) {
  try { localStorage.setItem(`sm_afgevinkt_${email}_${week}`, '1'); } catch (e) {}
}

function smRemoveWeekAfgevinkt(email, week) {
  try { localStorage.removeItem(`sm_afgevinkt_${email}_${week}`); } catch (e) {}
}

function smToggleWeekAfgevinkt(email, week) {
  if (smIsWeekAfgevinkt(email, week)) {
    smRemoveWeekAfgevinkt(email, week);
  } else {
    smSetWeekAfgevinkt(email, week);
  }
}

function parseStageDate(text) {
  const monthMap = {
    jan: 0, feb: 1, mrt: 2, apr: 3, mei: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11,
  };
  const parts = String(text).trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return null;
  const day = Number(parts[0].replace(/[^0-9]/g, ''));
  const month = monthMap[parts[1]];
  if (!Number.isFinite(day) || month === undefined) return null;
  return new Date(2026, month, day);
}

function formatShortDate(date) {
  const monthNames = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

function getWeekRange(stagiair, weekNum) {
  const start = parseStageDate(stagiair.start);
  if (!start) {
    return stagiair.start + ' - ' + stagiair.einde;
  }
  const weekStart = new Date(start.getTime());
  weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7);
  const weekEnd = new Date(weekStart.getTime());
  weekEnd.setDate(weekStart.getDate() + 4);
  return `${formatShortDate(weekStart)} t/m ${formatShortDate(weekEnd)}`;
}

function getWeekLogEntries(weekNum) {
  const sampleWeek1 = [
    {
      name: 'Maandag',
      date: '3 feb',
      submitted: true,
      sections: [
        { title: 'Beschrijving van uitgevoerde taken', text: 'Vandaag heb ik gewerkt aan het opzetten van de ontwikkelomgeving en kennismaking met het team. We hebben een kickoff meeting gehad waar de projectdoelen werden toegelicht.' },
        { title: 'Reflectie', text: 'Ik heb geleerd hoe belangrijk goede communicatie is binnen een team. Het was interessant om te zien hoe professionele projecten worden opgezet.' },
        { title: 'Problemen of leerpunten', text: 'Geen bijzondere problemen. Wel veel nieuwe informatie in korte tijd.' },
      ],
    },
    {
      name: 'Dinsdag',
      date: '4 feb',
      submitted: true,
      sections: [
        { title: 'Beschrijving van uitgevoerde taken', text: 'Verder gewerkt aan het installeren van dependencies en het bestuderen van de bestaande codebase. Paired programming sessie met een senior developer.' },
        { title: 'Reflectie', text: 'Agile werkwijze is nieuw voor me maar werkt goed. Korte meetings houden iedereen op de hoogte.' },
        { title: 'Problemen of leerpunten', text: 'Bug was lastiger dan verwacht, moest debugging tools beter leren gebruiken.' },
      ],
    },
    {
      name: 'Woensdag',
      date: '5 feb',
      submitted: false,
      sections: [
        { title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' },
      ],
    },
    {
      name: 'Donderdag',
      date: '6 feb',
      submitted: true,
      sections: [
        { title: 'Beschrijving van uitgevoerde taken', text: 'Gewerkt aan een bugfix in de user interface. Deelgenomen aan daily standup en sprint planning meeting.' },
        { title: 'Reflectie', text: 'Agile werkwijze is nieuw voor me maar werkt goed. Korte meetings houden iedereen op de hoogte.' },
        { title: 'Problemen of leerpunten', text: 'Bug was lastiger dan verwacht, moest debugging tools beter leren gebruiken.' },
      ],
    },
    {
      name: 'Vrijdag',
      date: '7 feb',
      submitted: true,
      sections: [
        { title: 'Beschrijving van uitgevoerde taken', text: 'Afronding van de bugfix en deployment naar testomgeving. Retrospective meeting met het team over de afgelopen sprint.' },
        { title: 'Reflectie', text: 'Eerste week succesvol afgerond. Ik voel me meer onderdeel van het team en begrijp de workflow beter.' },
        { title: 'Problemen of leerpunten', text: 'Geen bijzondere problemen meer. Goede eerste week gehad.' },
      ],
    },
  ];

  if (weekNum === 1) {
    return sampleWeek1;
  }

  return [
    { name: 'Maandag', date: 'N.v.t.', submitted: false, sections: [{ title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' }] },
    { name: 'Dinsdag', date: 'N.v.t.', submitted: false, sections: [{ title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' }] },
    { name: 'Woensdag', date: 'N.v.t.', submitted: false, sections: [{ title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' }] },
    { name: 'Donderdag', date: 'N.v.t.', submitted: false, sections: [{ title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' }] },
    { name: 'Vrijdag', date: 'N.v.t.', submitted: false, sections: [{ title: 'Beschrijving van uitgevoerde taken', text: 'Deze dag is nog niet ingevuld door de student.' }] },
  ];
}

function smGetWeekComment(email, week) {
  try { return localStorage.getItem(`sm_comment_${email}_${week}`) || ''; } catch (e) { return ''; }
}

function smSaveWeekComment(email, week, text) {
  try { localStorage.setItem(`sm_comment_${email}_${week}`, text); } catch (e) {}
}

function smEvaluationScoreKey(email, type, competentie) {
  return `sm_eval_score_${email}_${type}_${competentie}`;
}

function smEvaluationFeedbackKey(email, type, competentie) {
  return `sm_eval_feedback_${email}_${type}_${competentie}`;
}

function smGetEvaluationScore(email, type, competentie) {
  try { return localStorage.getItem(smEvaluationScoreKey(email, type, competentie)) || ''; } catch (e) { return ''; }
}

function smSaveEvaluationScore(email, type, competentie, score) {
  try { localStorage.setItem(smEvaluationScoreKey(email, type, competentie), String(score)); } catch (e) {}
}

function smGetEvaluationFeedback(email, type, competentie) {
  try { return localStorage.getItem(smEvaluationFeedbackKey(email, type, competentie)) || ''; } catch (e) { return ''; }
}

function smSaveEvaluationFeedback(email, type, competentie, text) {
  try { localStorage.setItem(smEvaluationFeedbackKey(email, type, competentie), text); } catch (e) {}
}

function renderBadge(badge) {
  return `<span class="sm-badge sm-badge--${badge.type}">${badge.label}</span>`;
}

function renderStagiairKaart(stagiair, index) {
  return `
    <div class="sm-stagiair-card">
      <div class="sm-stagiair-row">
        <div>
          <h2 class="sm-stagiair-naam">${stagiair.naam}</h2>
          <p class="sm-stagiair-functie">${stagiair.functie}</p>
          <p class="sm-stagiair-email">${stagiair.email}</p>
        </div>
        <div class="sm-stagiair-badges">
          ${stagiair.badges.map(renderBadge).join('')}
        </div>
      </div>
      <div class="sm-stagiair-bottom">
        <div class="sm-stagiair-dates">
          <div><span class="sm-stagiair-label">Start:</span> ${stagiair.start}</div>
          <div><span class="sm-stagiair-label">Einde:</span> ${stagiair.einde}</div>
        </div>
        <button class="sm-button" data-index="${index}">Student Bekijken</button>
      </div>
    </div>
  `;
}

function renderSectionContent() {
  return `
    <div class="sm-stagiair-list">
      <p class="sm-welcome">Welkom, Mieke Peeters</p>
      ${stagiairs.map(renderStagiairKaart).join('')}
    </div>
  `;
}

function renderStudentDetail(app, stagiair) {
  app.innerHTML = `
    <div class="sm-layout">
      <aside class="sm-sidebar sm-sidebar--detail">
        <div class="sm-sidebar-top">
          <div class="sm-logo">
            <span class="sm-logo-title">Stage Monitoring</span>
            <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
          </div>
          <nav class="sm-nav sm-nav--detail">
            <a href="#" class="sm-nav-item active" data-page="overzicht">Overzicht</a>
            <a href="#" class="sm-nav-item" data-page="stagedetails">Stagedetails</a>
            <a href="#" class="sm-nav-item" data-page="documenten">Documenten</a>
            <a href="#" class="sm-nav-item" data-page="logboek">Logboek</a>
            <a href="#" class="sm-nav-item" data-page="evaluatie">Evaluatie</a>
          </nav>
        </div>
        <div class="sm-sidebar-bottom">
          <span class="sm-user-name">Mieke Peeters</span>
          <a href="#" class="sm-logout" id="sm-logout">Uitloggen</a>
        </div>
      </aside>
      <main class="sm-main sm-main--detail">
        <div class="sm-detail-top">
          <a href="#" class="sm-detail-back" id="sm-back">← Terug naar stagiairs</a>
          <div>
            <h1 class="sm-detail-title">Stagiair: ${stagiair.naam}</h1>
            <p class="sm-detail-email">${stagiair.email}</p>
          </div>
        </div>
        <div class="sm-detail-grid">
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Stage Periode</p>
            <p class="sm-detail-card-value">${stagiair.start} - ${stagiair.einde}</p>
            <p class="sm-detail-card-meta">${stagiair.totalWeeks} weken totaal</p>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Logboek Status</p>
            <p class="sm-detail-card-value">${stagiair.currentWeek} / ${stagiair.totalWeeks} weken</p>
            <div class="sm-progress">
              <div class="sm-progress-bar" style="width: ${Math.round((stagiair.currentWeek / stagiair.totalWeeks) * 100)}%"></div>
            </div>
          </div>
          <div class="sm-detail-card">
            <p class="sm-detail-card-label">Bedrijf</p>
            <p class="sm-detail-card-value">${stagiair.bedrijf}</p>
            <p class="sm-detail-card-meta">${stagiair.bedrijfFunctie}</p>
          </div>
        </div>
        <div class="sm-detail-actions">
          <div class="sm-action-card" data-action="logboek">
            <span class="sm-action-icon">📘</span>
            <div>
              <p class="sm-action-title">Logboek Controleren</p>
              <p class="sm-action-text">Bekijk dagelijkse activiteiten</p>
            </div>
          </div>
          <div class="sm-action-card" data-action="evaluaties">
            <span class="sm-action-icon">📝</span>
            <div>
              <p class="sm-action-title">Evaluaties</p>
              <p class="sm-action-text">Geef feedback en beoordeling</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  document.querySelector('#sm-back').addEventListener('click', function(event) {
    event.preventDefault();
    renderMijnStagiairs(app);
  });

  document.querySelectorAll('.sm-nav-item').forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      const page = item.dataset.page;
      if (page === 'logboek') {
        renderLogboekOverview(app, stagiair);
      } else if (page === 'evaluatie') {
        renderEvaluatiePage(app, stagiair, 'tussentijds');
      } else if (page === 'overzicht') {
        renderStudentDetail(app, stagiair);
      }
    });
  });

  document.querySelectorAll('.sm-action-card').forEach(function(card) {
    card.addEventListener('click', function() {
      const action = card.dataset.action;
      if (action === 'logboek') {
        renderLogboekOverview(app, stagiair);
      } else if (action === 'evaluaties') {
        renderEvaluatiePage(app, stagiair, 'tussentijds');
      }
    });
  });
}
  
      function renderEvaluatiePage(app, stagiair, activeTab = 'tussentijds') {
        const scores = [1, 2, 3, 4, 5];
        const scoreDescriptions = {
          1: '{competentie} is niet of onvoldoende aangetoond binnen de verwachtingen van de stage.',
          2: '{competentie} is niet aanwezig; belangrijke aspecten ontbreken of zijn nog onzeker.',
          3: '{competentie} wordt voldoende uitgevoerd, maar nog niet volledig zelfstandig of consistent.',
          4: '{competentie} wordt correct uitgevoerd, met af en toe lichte begeleiding of bijsturing nodig.',
          5: '{competentie} wordt zelfstandig en boven de verwachtingen uitgevoerd, met initiatief en reflectie.',
        };
        const pageTitle = activeTab === 'finale' ? 'Finale evaluatie' : 'Tussentijdse evaluatie';
        const pageDescription = activeTab === 'finale'
          ? 'Geef per competentie een finale score en feedback. De student geeft ook zelf een score — de docent ziet beide en bepaalt het definitieve punt.'
          : 'Geef per competentie een score en feedback. De student geeft ook zelf een score — de docent ziet beide en bepaalt het finale punt.';

        app.innerHTML = `
          <div class="sm-layout">
            <aside class="sm-sidebar sm-sidebar--detail">
              <div class="sm-sidebar-top">
                <div class="sm-logo">
                  <span class="sm-logo-title">Stage Monitoring</span>
                  <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
                </div>
                <nav class="sm-nav sm-nav--detail">
                  <a href="#" class="sm-nav-item" data-page="overzicht">Overzicht</a>
                  <a href="#" class="sm-nav-item" data-page="stagedetails">Stagedetails</a>
                  <a href="#" class="sm-nav-item" data-page="documenten">Documenten</a>
                  <a href="#" class="sm-nav-item" data-page="logboek">Logboek</a>
                  <a href="#" class="sm-nav-item active" data-page="evaluatie">Evaluatie</a>
                </nav>
              </div>
              <div class="sm-sidebar-bottom">
                <span class="sm-user-name">Mieke Peeters</span>
                <a href="#" class="sm-logout">Uitloggen</a>
              </div>
            </aside>
            <main class="sm-main sm-main--detail">
              <div class="sm-detail-top sm-detail-top--evaluatie">
                <div>
                  <h1 class="sm-detail-title">${pageTitle}</h1>
                  <p class="sm-detail-email">${pageDescription}</p>
                </div>
                <a href="#" class="sm-detail-back" id="sm-back-evaluatie">← Terug naar stagiairs</a>
              </div>
              <div class="sm-eval-tabs">
                <button class="sm-eval-tab ${activeTab === 'tussentijds' ? 'active' : ''}" data-tab="tussentijds">Tussentijdse evaluatie</button>
                <button class="sm-eval-tab ${activeTab === 'finale' ? 'active' : ''}" data-tab="finale">Finale evaluatie</button>
              </div>
              <div class="sm-eval-content">
                <div class="sm-eval-summary">
                  <h2>${activeTab === 'finale' ? 'Finale beoordeling' : 'Tussentijdse bespreking'}</h2>
                  <p>${pageDescription}</p>
                </div>
                ${competenties.map(comp => `
                  <div class="sm-eval-block">
                    <div class="sm-eval-block-header">
                      <div>
                        <h3>${comp.title}</h3>
                        <p>${comp.description}</p>
                      </div>
                    </div>
                    <div class="sm-eval-score-panel">
                      <div class="sm-eval-score-note">HOE SCOOR JE DEZE COMPETENTIE? KLIK OP EEN SCORE (1 = LAAG, 5 = HOOG)</div>
                      <div class="sm-eval-score-cards" data-competentie="${comp.key}">
                        ${scores.map(score => `
                          <button class="sm-score-card sm-score-card--${score}" data-score="${score}" data-competentie="${comp.key}">
                            <span class="sm-score-card-number">${score}</span>
                            <span class="sm-score-card-text">${scoreDescriptions[score].replace('{competentie}', comp.title)}</span>
                          </button>
                        `).join('')}
                      </div>
                    </div>
                    <div class="sm-eval-mentor-panel ${activeTab === 'finale' ? 'sm-eval-mentor-panel--finale' : ''}">
                      <div class="sm-eval-mentor-title">Jouw beoordeling (mentor)</div>
                      <label class="sm-eval-feedback-label">Feedback</label>
                      <textarea class="sm-eval-feedback" data-feedback="${comp.key}" placeholder="${activeTab === 'finale' ? 'Beschrijf je gemotiveerde feedback...' : 'Beschrijf je feedback over de vorderingen van de student...'}">${smGetEvaluationFeedback(stagiair.email, activeTab, comp.key)}</textarea>
                    </div>
                  </div>
                `).join('')}
                <div class="sm-eval-actions">
                  <button class="sm-button sm-eval-save" id="sm-eval-save">Beoordeling Opslaan</button>
                </div>
                <div class="sm-eval-save-message hidden" id="sm-eval-save-message">Evaluatie opgeslagen.</div>
              </div>
            </main>
          </div>
        `;

        document.querySelector('#sm-back-evaluatie').addEventListener('click', function(e) {
          e.preventDefault();
          renderStudentDetail(app, stagiair);
        });

        document.querySelectorAll('.sm-score-card').forEach(function(card) {
          const existingScore = smGetEvaluationScore(stagiair.email, activeTab, card.dataset.competentie);
          if (existingScore && existingScore === card.dataset.score) {
            card.classList.add('selected');
          }
          card.addEventListener('click', function() {
            const container = card.closest('.sm-eval-score-cards');
            if (!container) return;
            container.querySelectorAll('.sm-score-card').forEach(function(btn) { btn.classList.remove('selected'); });
            card.classList.add('selected');
          });
        });

        document.querySelectorAll('.sm-nav-item').forEach(function(item) {
          item.addEventListener('click', function(event) {
            event.preventDefault();
            const page = item.dataset.page;
            if (page === 'logboek') {
              renderLogboekOverview(app, stagiair);
            } else if (page === 'evaluatie') {
              renderEvaluatiePage(app, stagiair, 'tussentijds');
            } else if (page === 'overzicht') {
              renderStudentDetail(app, stagiair);
            }
          });
        });

        document.querySelectorAll('.sm-eval-tab').forEach(function(tab) {
          tab.addEventListener('click', function() {
            const selected = tab.dataset.tab;
            renderEvaluatiePage(app, stagiair, selected);
          });
        });

        document.querySelector('#sm-eval-save').addEventListener('click', function() {
          document.querySelectorAll('.sm-eval-block').forEach(function(block) {
            const compKey = block.querySelector('.sm-eval-score-cards').dataset.competentie;
            const selectedCard = block.querySelector('.sm-score-card.selected');
            const scoreValue = selectedCard ? Number(selectedCard.dataset.score) : null;
            const feedbackArea = block.querySelector('.sm-eval-feedback');
            const feedbackText = feedbackArea ? feedbackArea.value.trim() : '';
            if (scoreValue !== null) {
              smSaveEvaluationScore(stagiair.email, activeTab, compKey, scoreValue);
            }
            smSaveEvaluationFeedback(stagiair.email, activeTab, compKey, feedbackText);
          });

          const saveMessage = document.querySelector('#sm-eval-save-message');
          if (saveMessage) {
            saveMessage.textContent = 'Evaluatie opgeslagen.';
            saveMessage.classList.remove('hidden');
          }
        });
      }
  
      function renderLogboekOverview(app, stagiair) {
        // generate week items
        const weeks = Array.from({length: stagiair.totalWeeks}, (_, i) => {
          const weekNum = i + 1;
          const afgevinkt = smIsWeekAfgevinkt(stagiair.email, weekNum);
          const filled = afgevinkt ? 5 : (weekNum <= stagiair.currentWeek ? 5 : 0);
          const status = afgevinkt ? 'Afgevinkt' : (filled === 5 ? 'Ingevuld' : 'Nog niet afgevinkt');
          return {weekNum, dateRange: getWeekRange(stagiair, weekNum), filled, total: 5, status};
        });
  
        app.innerHTML = `
          <div class="sm-layout">
            <aside class="sm-sidebar sm-sidebar--detail">
              <div class="sm-sidebar-top">
                <div class="sm-logo">
                  <span class="sm-logo-title">Stage Monitoring</span>
                  <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
                </div>
                <nav class="sm-nav sm-nav--detail">
                  <a href="#" class="sm-nav-item" data-page="overzicht">Overzicht</a>
                  <a href="#" class="sm-nav-item" data-page="stagedetails">Stagedetails</a>
                  <a href="#" class="sm-nav-item active" data-page="logboek">Logboek</a>
                  <a href="#" class="sm-nav-item" data-page="evaluatie">Evaluatie</a>
                </nav>
              </div>
              <div class="sm-sidebar-bottom">
                <span class="sm-user-name">Mieke Peeters</span>
                <a href="#" class="sm-logout">Uitloggen</a>
              </div>
            </aside>
            <main class="sm-main sm-main--detail">
              <div class="sm-detail-top">
                <a href="#" class="sm-detail-back" id="sm-back-logboek">← Terug naar stagiairs</a>
                <div>
                  <h1 class="sm-detail-title">Logboek - Weekoverzicht</h1>
                  <p class="sm-detail-email">Bekijk en controleer de wekelijkse logboeken van ${stagiair.naam}</p>
                </div>
              </div>
  
              <div class="sm-logboek-list">
                ${weeks.map(w => `
                  <div class="sm-week-card" data-week="${w.weekNum}">
                    <div class="sm-week-left">
                      <h3>Week ${w.weekNum}</h3>
                      <p class="sm-week-dates">${w.dateRange}</p>
                    </div>
                    <div class="sm-week-right">
                      <div class="sm-week-progress-text">${w.filled}/${w.total} dagen ingevuld</div>
                      <div class="sm-week-progress">
                        <div class="sm-week-progress-bar" style="width: ${Math.round((w.filled / w.total) * 100)}%"></div>
                      </div>
                      <span class="sm-status-badge ${w.status === 'Afgevinkt' ? 'sm-status--ok' : 'sm-status--pending'}">${w.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </main>
          </div>
        `;
  
        document.querySelector('#sm-back-logboek').addEventListener('click', function(e) {
          e.preventDefault();
          renderStudentDetail(app, stagiair);
        });

        document.querySelectorAll('.sm-nav-item').forEach(function(item) {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = item.dataset.page;
            if (page === 'logboek') {
              renderLogboekOverview(app, stagiair);
            } else if (page === 'evaluatie') {
              renderEvaluatiePage(app, stagiair, 'tussentijds');
            } else if (page === 'overzicht') {
              renderStudentDetail(app, stagiair);
            }
          });
        });

        // open week detail when a week card is clicked
        document.querySelectorAll('.sm-week-card').forEach(function(card) {
          card.style.cursor = 'pointer';
          card.addEventListener('click', function() {
            const week = Number(card.dataset.week);
            renderWeekDetail(app, stagiair, week);
          });
        });
      }

      function renderWeekDetail(app, stagiair, week) {
        const comment = smGetWeekComment(stagiair.email, week);
        const afgevinkt = smIsWeekAfgevinkt(stagiair.email, week);
        const weekRange = getWeekRange(stagiair, week);
        const dayEntries = getWeekLogEntries(week);

        app.innerHTML = `
          <div class="sm-layout">
            <aside class="sm-sidebar sm-sidebar--detail">
              <div class="sm-sidebar-top">
                <div class="sm-logo">
                  <span class="sm-logo-title">Stage Monitoring</span>
                  <span class="sm-logo-sub">Erasmushogeschool Brussel</span>
                </div>
                <nav class="sm-nav sm-nav--detail">
                  <a href="#" class="sm-nav-item" data-page="overzicht">Overzicht</a>
                  <a href="#" class="sm-nav-item" data-page="stagedetails">Stagedetails</a>
                  <a href="#" class="sm-nav-item" data-page="logboek">Logboek</a>
                  <a href="#" class="sm-nav-item" data-page="evaluatie">Evaluatie</a>
                </nav>
              </div>
              <div class="sm-sidebar-bottom">
                <span class="sm-user-name">Mieke Peeters</span>
                <a href="#" class="sm-logout">Uitloggen</a>
              </div>
            </aside>
            <main class="sm-main sm-main--detail">
              <div class="sm-detail-top">
                <a href="#" class="sm-detail-back" id="sm-back-week">← Terug naar logboek</a>
                <div>
                  <h1 class="sm-detail-title">Week ${week}</h1>
                  <p class="sm-detail-subtitle">${weekRange}</p>
                  <div class="sm-week-summary-row">
                    <span class="sm-status-pill ${afgevinkt ? 'sm-status--ok' : 'sm-status--pending'}">${afgevinkt ? 'Afgevinkt' : 'Open'}</span>
                    <button class="sm-button sm-week-check" id="sm-week-toggle">${afgevinkt ? 'Markeer als niet afgevinkt' : 'Week afvinken'}</button>
                  </div>
                  <p class="sm-detail-email">Bekijk het logboek van ${stagiair.naam}</p>
                </div>
              </div>
              <div class="sm-week-day-list">
                ${dayEntries.map(day => `
                  <div class="sm-week-day-card">
                    <div class="sm-week-day-header">
                      <div>
                        <h2 class="sm-week-day-name">${day.name}</h2>
                        <p class="sm-week-day-date">${day.date}</p>
                      </div>
                      <span class="sm-status-pill ${day.submitted ? 'sm-status--ok' : 'sm-status--pending'}">${day.submitted ? 'Ingediend' : 'Nog niet ingevuld'}</span>
                    </div>
                    ${day.sections.map(section => `
                      <div class="sm-week-section">
                        <p class="sm-week-section-title">${section.title}</p>
                        <div class="sm-week-section-body">${section.text}</div>
                      </div>
                    `).join('')}
                  </div>
                `).join('')}
              </div>
              <div class="sm-week-comment-card">
                <label class="sm-week-comment-label" for="sm-week-comment">Opmerking bij Week ${week}</label>
                <textarea id="sm-week-comment" class="sm-week-comment" placeholder="Laat hier een opmerking of reactie achter bij het logboek van deze week...">${comment}</textarea>
              </div>
              <div class="sm-eval-actions">
                <button class="sm-button" id="sm-week-save">Opmerking Opslaan</button>
              </div>
            </main>
          </div>
        `;

        document.querySelector('#sm-back-week').addEventListener('click', function(event) {
          event.preventDefault();
          renderLogboekOverview(app, stagiair);
        });

        document.querySelector('#sm-week-toggle').addEventListener('click', function() {
          smToggleWeekAfgevinkt(stagiair.email, week);
          renderWeekDetail(app, stagiair, week);
        });

        document.querySelector('#sm-week-save').addEventListener('click', function() {
          const text = document.querySelector('#sm-week-comment').value.trim();
          smSaveWeekComment(stagiair.email, week, text);
        });
      }

  // attach click handlers on the stagiairs list
  function setupStudentLinks(app) {
    document.querySelectorAll('.sm-button[data-index]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const idx = Number(btn.dataset.index);
        const s = stagiairs[idx];
        if (s) {
          renderStudentDetail(app, s);
        }
      });
    });
  }


  // exported entrypoint used by src/main.js
  export function renderMijnStagiairs(app) {
    // render the simple list view and wire up student links
    app.innerHTML = renderSectionContent();
    setupStudentLinks(app);
  }
