import './afkeuring.css';

export function renderAfkeuring(container, userName = '[Studentnaam]', stageData = null) {
    const feedback = stageData?.feedback || 'Geen feedback opgegeven door de stagecommissie.';
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend bedrijf';

    container.innerHTML = `
        <div class="afkeuring-layout">

            <!-- Linkerzijbalk -->
            <aside class="afkeuring-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="/?role=stageformulier" class="sidebar-nav-item">Nieuwe Aanvraag</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="afkeuring-main">

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
                            <div class="step-circle">&#10007;</div>
                            <span class="step-label">Afgekeurd</span>
                            <span class="step-sub">Afgewezen</span>
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

                <div class="afkeuring-statusbar">
                    <span class="afkeuring-status-pill">Aanvraag afgekeurd</span>
                    <p class="status-description">Je stagevoorstel voor <strong>${bedrijfNaam}</strong> is helaas afgekeurd door de stagecommissie.</p>
                </div>

                <section class="afkeuring-card">
                    <div class="afkeuring-card-icon">&#10007;</div>
                    <h1>Stageaanvraag Afgekeurd</h1>
                    <p>De stagecommissie heeft je aanvraag beoordeeld en besloten deze niet goed te keuren.</p>

                    <div class="afkeuring-feedback-box">
                        <h3>Feedback van de stagecommissie:</h3>
                        <p class="afkeuring-feedback-text">${feedback}</p>
                    </div>

                    <div class="afkeuring-actions">
                        <p>Je kunt een nieuwe stageaanvraag indienen voor een ander bedrijf of contact opnemen met je docent voor meer informatie.</p>
                        <button class="afkeuring-btn-primary" id="afkeuring-nieuwe-aanvraag">Nieuwe Stageaanvraag Indienen</button>
                    </div>
                </section>

            </main>

        </div>
    `;

    const nieuwAanvraagBtn = container.querySelector('#afkeuring-nieuwe-aanvraag');
    if (nieuwAanvraagBtn) {
        nieuwAanvraagBtn.addEventListener('click', () => {
            window.location.search = '?role=stageformulier';
        });
    }
}
