import './feedback.css';

export async function renderFeedback(container, user = null, stageData = null) {
    let displayName = 'Student';
    if (user && user.last_name && user.first_name) {
        displayName = `${user.last_name.toUpperCase()} ${user.first_name}`;
    } else if (user && user.first_name) {
        displayName = user.first_name;
    }

    if (!stageData) {
        try {
            const meRes = await fetch('/me', { credentials: 'include' });
            const meData = await meRes.json();
            if (meData.loggedIn && meData.user) {
                if (!user) user = meData.user;
                if (displayName === 'Student') {
                    if (meData.user.last_name && meData.user.first_name) {
                        displayName = `${meData.user.last_name.toUpperCase()} ${meData.user.first_name}`;
                    } else {
                        displayName = meData.user.first_name || 'Student';
                    }
                }
                const stageRes = await fetch(`/api/stages/student/${meData.user.user_id}`, { credentials: 'include' });
                stageData = await stageRes.json();
            }
        } catch {}
    }

    const feedback = stageData?.feedback || 'Geen feedback opgegeven door de stagecommissie.';
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend bedrijf';

    container.innerHTML = `
        <div class="feedback-layout">

            <!-- Linkerzijbalk -->
            <aside class="feedback-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${displayName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="feedback-main">

                <!-- Voortgangsbalk (Stepper) -->
                <div class="stepper-wrapper">
                    <div class="stepper">
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Aanvraag</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step rejected">
                            <div class="step-circle">&#9888;</div>
                            <span class="step-label">Aanpassingen</span>
                            <span class="step-sub">Actief</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">3</div>
                            <span class="step-label">Goedgekeurd</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span class="step-label">Stage gestart</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">5</div>
                            <span class="step-label">Evaluatie</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                    </div>
                </div>

                <div class="feedback-statusbar">
                    <span class="feedback-status-pill">Aanpassingen vereist</span>
                    <p class="status-description">Je stagevoorstel voor <strong>${bedrijfNaam}</strong> heeft aanpassingen nodig. Bekijk de feedback hieronder.</p>
                </div>

                <!-- Feedback card in het midden -->
                <section class="feedback-card">
                    <div class="feedback-card-icon">&#9888;</div>
                    <h1>Aanpassingen Vereist</h1>
                    <p>De stagecommissie heeft je aanvraag beoordeeld en voldoende aanpassingen gevraagd.</p>

                    <div class="feedback-box">
                        <h3>Feedback van de stagecommissie:</h3>
                        <p class="feedback-text">${feedback}</p>
                    </div>

                    <div class="feedback-actions">
                        <p>Corrigeer je aanvraag en dien deze opnieuw in met de juiste gegevens.</p>
                        <button class="feedback-btn-primary" id="feedback-aanpassen">Stagevoorstel Aanpassen</button>
                    </div>
                </section>

            </main>

        </div>
    `;

    const aanpassenBtn = container.querySelector('#feedback-aanpassen');
    if (aanpassenBtn) {
        aanpassenBtn.addEventListener('click', () => {
            window.location.pathname = '/aanpassen';
        });
    }
}
