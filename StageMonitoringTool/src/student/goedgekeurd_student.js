import './goedgekeurd_student.css';

export function renderGoedgekeurdStudent(container, userName = 'Jan Janssens', stageData = null) {
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend';
    const bedrijfAdres = stageData?.bedrijf?.adres || '';
    const startDatum = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Nog niet vastgelegd';
    const eindDatum = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Nog niet vastgelegd';
    const omschrijving = stageData?.stageDetails?.omschrijving || '';
    const docValidated = stageData?.document_validated || false;

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
                        <a href="?role=stagedetails" class="sidebar-nav-item">Stagedetails</a>
                        <a href="?role=documenten" class="sidebar-nav-item">Documenten</a>
                        <a href="${docValidated ? '?role=logboek' : '#'}" class="sidebar-nav-item${docValidated ? '' : ' disabled'}">Logboek</a>
                        <a href="${docValidated ? '#' : '#'}" class="sidebar-nav-item${docValidated ? '' : ' disabled'}">Evaluatie</a>
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
                        <div class="step-line ${docValidated ? 'completed' : ''}"></div>
                        <div class="step ${docValidated ? 'completed' : 'active'}">
                            <div class="step-circle">${docValidated ? '&#10003;' : '3'}</div>
                            <span class="step-label">Document</span>
                            <span class="step-sub">${docValidated ? 'Voltooid' : 'Actief'}</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step${docValidated ? ' next-active' : ''}">
                            <div class="step-circle step-icon-logboek">${docValidated ? '&#128203;' : '4'}</div>
                            <span class="step-label">Logboek</span>
                            <span class="step-sub">${docValidated ? '0/16 weken' : 'Gepland'}</span>
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
                            <span class="info-card-sub">${stageData?.stageDetails?.start && stageData?.stageDetails?.einde ? 'Stage goedgekeurd' : 'Wacht op vastlegging'}</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Logboek Status</span>
                            <span class="info-card-icon">&#128203;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main"><span class="logboek-count">0</span> / 16 weken</span>
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
                            <span class="info-card-sub">${bedrijfAdres || 'Locatie nog niet opgegeven'}</span>
                        </div>
                    </div>
                </section>

                <!-- Actie Kaarten Sectie -->
                <section class="coming-soon-section">
                    <div class="coming-soon-cards">
                        <div class="coming-soon-card${docValidated ? ' active-card' : ''}">
                            <div class="coming-soon-icon${docValidated ? ' active-icon' : ''}">&#128203;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title${docValidated ? ' active-title' : ''}">Logboek Invullen</h3>
                                <p class="coming-soon-sub${docValidated ? ' active-sub' : ''}">Vul je dagelijkse activiteiten in</p>
                            </div>
                        </div>
                        <div class="coming-soon-card${docValidated ? ' active-card' : ''}">
                            <div class="coming-soon-icon${docValidated ? ' active-icon' : ''}">&#128202;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title${docValidated ? ' active-title' : ''}">Evaluaties</h3>
                                <p class="coming-soon-sub${docValidated ? ' active-sub' : ''}">Bekijk je voortgang en feedback</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}
