import './documenten-ingedient.css';

export function renderDocumentenIngedient(container, userName = 'Jan Janssens') {
    container.innerHTML = `
        <div class="documenten-layout">

            <!-- Linkerzijbalk -->
            <aside class="documenten-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="?role=goedgekeurd_student" class="sidebar-nav-item">Overzicht</a>
                        <a href="?role=stagedetails" class="sidebar-nav-item">Stagedetails</a>
                        <a href="?role=documenten" class="sidebar-nav-item active">Documenten</a>
                        <a href="#" class="sidebar-nav-item disabled">Logboek</a>
                        <a href="#" class="sidebar-nav-item disabled">Evaluatie</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="documenten-main">

                <h1 class="page-title">Documenten</h1>

                <div class="ingedient-card">
                    <div class="ingedient-icon">&#10003;</div>
                    <h2 class="ingedient-title">Stageovereenkomst succesvol geüpload!</h2>
                    <p class="ingedient-text">Je document is ontvangen en wacht op controle en goedkeuring van de administrator.</p>

                    <hr class="ingedient-divider">

                    <h3 class="ingedient-status-title">Wat gebeurt er nu?</h3>

                    <div class="ingedient-timeline">
                        <div class="ingedient-step ingedient-step--done">
                            <div class="ingedient-step-icon">&#10003;</div>
                            <div class="ingedient-step-body">
                                <strong>Document ingediend</strong>
                                <p>Je stageovereenkomst is succesvol geüpload naar het systeem.</p>
                            </div>
                        </div>
                        <div class="ingedient-step-connector ingedient-step-connector--done"></div>

                        <div class="ingedient-step ingedient-step--pending">
                            <div class="ingedient-step-icon">&#8987;</div>
                            <div class="ingedient-step-body">
                                <strong>Admin valideert je document</strong>
                                <p>De administrator controleert je stageovereenkomst. Je ontvangt hier een melding "Gevalideerd" zodra dit goedgekeurd is.</p>
                            </div>
                        </div>
                        <div class="ingedient-step-connector"></div>

                        <div class="ingedient-step ingedient-step--locked">
                            <div class="ingedient-step-icon">&#128274;</div>
                            <div class="ingedient-step-body">
                                <strong>Stage van start &amp; logboek invullen</strong>
                                <p>Eens je document goedgekeurd is en je stage begint, kan je dagelijks je logboek invullen via het platform.</p>
                            </div>
                        </div>
                    </div>

                    <div class="ingedient-note">
                        <p>&#128276; Je ontvangt een melding zodra de administrator je document heeft goedgekeurd.</p>
                    </div>
                </div>

            </main>

        </div>
    `;
}
