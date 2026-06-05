import './feedback.css';

export function renderFeedback(container, userName = '[Studentnaam]', feedback = null) {
    const defaultFeedback = {
        intro: 'De stage opdracht is interessant, maar er zijn enkele punten die verduidelijking nodig hebben:',
        punten: [
            'De omschrijving moet specifieker zijn over welke concrete projecten de student gaat uitvoeren.',
            'Geef meer details over de begeleiding: hoeveel tijd zal de mentor wekelijks beschikbaar zijn?',
            'Vermeld welke voorkennis vereist is.'
        ],
        conclusie: 'Pas de aanvraag aan met deze verduidelijkingen en dien opnieuw in.'
    };

    const fb = feedback || defaultFeedback;

    container.innerHTML = `
        <div class="feedback-dashboard">
            <!-- Header Sectie -->
            <header class="dashboard-header">
                <div class="brand">
                    <h1 class="brand-title">Stage Monitoring</h1>
                    <span class="brand-subtitle">Erasmushogeschool Brussel</span>
                </div>
                <div class="user-profile">
                    <span class="user-name" id="user-name-display">${userName}</span>
                    <a href="/" class="logout-link">Uitloggen</a>
                </div>
            </header>

            <main class="dashboard-content">
                <!-- Stappen sectie -->
                <section class="stepper-section">
                    <div class="stepper-container">
                        <!-- Step 1: Completed -->
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <div class="step-title">Aanvraag</div>
                            <div class="step-status">Voltooid</div>
                        </div>
                        <div class="step-line completed"></div>
                        <!-- Step 2: Actie vereist -->
                        <div class="step action-required">
                            <div class="step-circle">!</div>
                            <div class="step-title">In beoordeling</div>
                            <div class="step-status">Actie vereist</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 3: Actie vereist -->
                        <div class="step action-required">
                            <div class="step-circle">!</div>
                            <div class="step-title">Goedgekeurd</div>
                            <div class="step-status">Actie vereist</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 4: Gepland -->
                        <div class="step">
                            <div class="step-circle">4</div>
                            <div class="step-title">Stage actief</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 5: Gepland -->
                        <div class="step">
                            <div class="step-circle">5</div>
                            <div class="step-title">Evaluatie</div>
                            <div class="step-status">Gepland</div>
                        </div>
                    </div>
                </section>

                <!-- Status Balk -->
                <section class="status-bar">
                    <span class="status-pill">Aanpassingen vereist</span>
                    <p class="status-description">De stagecommissie heeft feedback gegeven op je stagevoorstel</p>
                </section>

                <!-- Feedback Sectie -->
                <section class="feedback-section">
                    <!-- Feedback Card -->
                    <div class="feedback-card">
                        <h2 class="feedback-card-title">Feedback van Stagecommissie</h2>
                        <div class="feedback-content">
                            <p class="feedback-intro">${fb.intro}</p>
                            <ol class="feedback-list">
                                ${fb.punten.map(punt => `<li>${punt}</li>`).join('')}
                            </ol>
                            <p class="feedback-conclusion">${fb.conclusie}</p>
                        </div>
                    </div>

                    <!-- Actie Card -->
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
            </main>
        </div>
    `;

    // Event listener voor "Stage Aanvraag Aanpassen" button
    const adjustBtn = container.querySelector('.action-button');
    if (adjustBtn) {
        adjustBtn.addEventListener('click', () => {
            window.location.href = '/?role=aanpassen';
        });
    }
}
