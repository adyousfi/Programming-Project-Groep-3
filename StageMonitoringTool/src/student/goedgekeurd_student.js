import './goedgekeurd_student.css';

export function renderGoedgekeurdStudent(container, userName = 'Jan Janssens', stageData = null) {
    const bedrijfNaam = stageData?.bedrijf?.naam || 'TechCorp';
    const startDatum = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '3 feb';
    const eindDatum = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '30 mei';

    container.innerHTML = `
        <div class="goedgekeurd-layout">
            <!-- Linkerzijbalk -->
            <aside class="goedgekeurd-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="?role=goedgekeurd_student" class="sidebar-nav-item active">Overzicht</a>
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
            <main class="goedgekeurd-main">
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
                            <span class="info-card-main">${startDatum} - ${eindDatum}</span>
                            <span class="info-card-sub">Stage goedgekeurd</span>
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
                            <span class="info-card-main">${bedrijfNaam}</span>
                            <span class="info-card-sub">Stage goedgekeurd</span>
                        </div>
                    </div>
                </section>

                <!-- Actie Kaarten Sectie (Binnenkort) -->
                <section class="coming-soon-section">
                    <p class="coming-soon-label">Binnenkort beschikbaar</p>
                    <div class="coming-soon-cards">
                        <div class="coming-soon-card">
                            <div class="coming-soon-icon">&#128203;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title">Logboek Invullen</h3>
                                <p class="coming-soon-sub">Vul je dagelijkse activiteiten in</p>
                            </div>
                        </div>
                        <div class="coming-soon-card">
                            <div class="coming-soon-icon">&#128202;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title">Evaluaties</h3>
                                <p class="coming-soon-sub">Bekijk je voortgang en feedback</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}
