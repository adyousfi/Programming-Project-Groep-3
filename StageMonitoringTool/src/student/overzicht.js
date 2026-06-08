import './overzicht.css';

export function renderOverzicht(container, userName = 'Jan Janssens') {
    container.innerHTML = `
        <div class="overzicht-layout">
            <!-- Linkerzijbalk -->
            <aside class="overzicht-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="#" class="sidebar-nav-item active">Overzicht</a>
                        <a href="#" class="sidebar-nav-item">Stagedetails</a>
                        <a href="?role=documenten" class="sidebar-nav-item">Documenten</a>
                        <a href="#" class="sidebar-nav-item">Logboek</a>
                        <a href="#" class="sidebar-nav-item">Evaluatie</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="overzicht-main">
                <h1 class="page-title">Stage Voortgang</h1>

                <!-- Voortgangsbalk (Stepper) -->
                <div class="stepper-wrapper">
                    <div class="stepper">
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Aanvraag</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Goedgekeurd</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step active">
                            <div class="step-circle">3</div>
                            <span class="step-label">Document</span>
                            <span class="step-sub">Actief</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span class="step-label">Logboek</span>
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

                <!-- Info Cards Sectie -->
                <section class="info-cards-section">
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Stage Periode</span>
                            <span class="info-card-icon">&#128197;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main">3 feb - 30 mei</span>
                            <span class="info-card-sub">16 weken totaal</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Logboek Status</span>
                            <span class="info-card-icon">&#128203;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main"><span class="logboek-count">2</span> / 16 weken</span>
                            <div class="logboek-progress-bar">
                                <div class="logboek-progress-fill"></div>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Bedrijf</span>
                            <span class="info-card-icon">&#127970;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main">TechCorp</span>
                            <span class="info-card-sub">Frontend Developer</span>
                        </div>
                    </div>
                </section>

                <!-- Actie Kaarten Sectie -->
                <section class="action-cards-section">
                    <div class="action-card">
                        <div class="action-card-icon blue">
                            <span>&#128203;</span>
                        </div>
                        <div class="action-card-content">
                            <h3 class="action-card-title">Logboek Invullen</h3>
                            <p class="action-card-subtitle">Vul je dagelijkse activiteiten in</p>
                        </div>
                    </div>
                    <div class="action-card">
                        <div class="action-card-icon purple">
                            <span>&#128202;</span>
                        </div>
                        <div class="action-card-content">
                            <h3 class="action-card-title">Evaluaties</h3>
                            <p class="action-card-subtitle">Bekijk je voortgang en feedback</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}
