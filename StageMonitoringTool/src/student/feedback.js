import './feedback.css';

export async function renderFeedback(container, userName = '[Studentnaam]') {
    container.innerHTML = `
        <div class="feedback-dashboard">
            <header class="dashboard-header">
                <div class="brand">
                    <h1 class="brand-title">Stage Monitoring</h1>
                    <span class="brand-subtitle">Erasmushogeschool Brussel</span>
                </div>
                <div class="user-profile">
                    <span class="user-name">${userName}</span>
                    <a href="/" class="logout-link">Uitloggen</a>
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
                        <div class="step">
                            <div class="step-circle">2</div>
                            <div class="step-title">In beoordeling</div>
                            <div class="step-status">In afwachting</div>
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

                <section class="status-bar">
                    <span class="status-pill">In afwachting</span>
                    <p class="status-description">Je aanvraag is ingediend en wordt beoordeeld door de stagecommissie.</p>
                </section>
            </main>
        </div>
    `;
}
