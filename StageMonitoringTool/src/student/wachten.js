import './wachten.css';

export function renderWachten(container, userName = '[Studentnaam]') {
    container.innerHTML = `
        <div class="wachten-layout">

            <!-- Linkerzijbalk -->
            <aside class="wachten-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="#" class="sidebar-nav-item active">In afwachting</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="wachten-main">

                <!-- Voortgangsbalk (Stepper) -->
                <div class="stepper-wrapper">
                    <div class="stepper">
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Aanvraag</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step active">
                            <div class="step-circle">2</div>
                            <span class="step-label">In beoordeling</span>
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

                <div class="wachten-statusbar">
                    <span class="wachten-status-pill">Ingediend, wachtend op goedkeuring</span>
                    <p class="status-description">Je stagevoorstel wordt beoordeeld door de stagecommissie.</p>
                </div>

                <section class="wachten-card">
                    <div class="wachten-card-icon">⏱</div>
                    <h1>Je stagevoorstel is ingediend</h1>
                    <p>De stagecommissie zal je aanvraag zo spoedig mogelijk beoordelen. Je ontvangt een melding zodra er een beslissing is genomen.</p>
                    <p class="wachten-card-note">In afwachting van goedkeuring heb je nog geen toegang tot je stagedossier.</p>
                </section>

            </main>

        </div>
    `;
}
