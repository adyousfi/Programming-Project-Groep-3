import './feedback.css';
import { getActiveProposalId, getProposalById } from './dataService.js';
import { logout } from '../utils/auth.js';

export async function renderFeedback(container, userName = '[Studentnaam]') {
    container.innerHTML = `<div class="feedback-dashboard"><main class="dashboard-content"><p>Feedback laden...</p></main></div>`;

    const activeId = getActiveProposalId();
    let proposal = null;
    let feedback = null;

    if (activeId) {
        proposal = await getProposalById(activeId);
        feedback = proposal?.feedback || null;
    }

    const hasFeedback = !!(feedback && feedback.intro);

    container.innerHTML = `
        <div class="feedback-dashboard">
            <header class="dashboard-header">
                <div class="brand">
                    <h1 class="brand-title">Stage Monitoring</h1>
                    <span class="brand-subtitle">Erasmushogeschool Brussel</span>
                </div>
                <div class="user-profile">
                    <span class="user-name" id="user-name-display">${proposal?.studentNaam || userName}</span>
                    <button id="feedback-logout-btn" class="logout-link">Uitloggen</button>
                </div>
            </header>

            <main class="dashboard-content">
                <section class="stepper-section">
                    <div class="stepper-container">
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <div class="step-title">Aanvraag</div>
                            <div class="step-status">Voltooid</div>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step ${hasFeedback ? 'action-required' : ''}">
                            <div class="step-circle">${hasFeedback ? '!' : '2'}</div>
                            <div class="step-title">In beoordeling</div>
                            <div class="step-status">${hasFeedback ? 'Actie vereist' : 'In afwachting'}</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">3</div>
                            <div class="step-title">Goedgekeurd</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <div class="step-title">Stage actief</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">5</div>
                            <div class="step-title">Evaluatie</div>
                            <div class="step-status">Gepland</div>
                        </div>
                    </div>
                </section>

                ${hasFeedback ? `
                <section class="status-bar">
                    <span class="status-pill">Aanpassingen vereist</span>
                    <p class="status-description">De stagecommissie heeft feedback gegeven op je stagevoorstel</p>
                </section>

                <section class="feedback-section">
                    <div class="feedback-card">
                        <h2 class="feedback-card-title">Feedback van Stagecommissie</h2>
                        <div class="feedback-content">
                            <p class="feedback-intro">${feedback.intro}</p>
                            <ol class="feedback-list">
                                ${feedback.punten.map(punt => `<li>${punt}</li>`).join('')}
                            </ol>
                            <p class="feedback-conclusion">${feedback.conclusie}</p>
                        </div>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </div>
                        <h3 class="action-title">Pas je stagevoorstel aan</h3>
                        <p class="action-subtitle">Verwerk de feedback van de stagecommissie en dien je voorstel opnieuw in</p>
                        <button class="action-button">Stage Aanvraag Aanpassen</button>
                    </div>
                </section>
                ` : `
                <section class="status-bar">
                    <span class="status-pill">In afwachting</span>
                    <p class="status-description">Je aanvraag is ingediend en wordt beoordeeld door de stagecommissie.</p>
                    <p style="margin-top:0.5rem;font-size:0.85rem;color:#888;">Voorstel ID: <code>${activeId}</code></p>
                </section>
                `}
            </main>
        </div>
    `;

    container.querySelector('#feedback-logout-btn').addEventListener('click', logout);

    const adjustBtn = container.querySelector('.action-button');
    if (adjustBtn) {
        adjustBtn.addEventListener('click', () => {
            window.location.href = '/?role=aanpassen';
        });
    }
}
