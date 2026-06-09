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
            <main class="documenten-main">

                <h1 class="page-title">Documenten</h1>

                <div class="ingedient-card">
                    <div class="ingedient-icon">&#10003;</div>
                    <h2 class="ingedient-title">Document succesvol ingediend!</h2>
                    <p class="ingedient-text">Je stageovereenkomst is succesvol geuploadd en ingediend.</p>

                    <hr class="ingedient-divider">

                    <div class="ingedient-status">
                        <h3 class="ingedient-status-title">Volgende stappen</h3>
                        <p class="ingedient-text">Voordat je stageovereenkomst compleet is, moeten de volgende personen ook hun handtekening zetten:</p>
                        <ul class="ingedient-list">
                            <li class="ingedient-list-item">
                                <span class="ingedient-person-icon">&#128100;</span>
                                <div>
                                    <strong>Docent (Begeleider)</strong>
                                    <p class="ingedient-person-sub">Je EhB docent moet het document reviewen en ondertekenen.</p>
                                </div>
                            </li>
                            <li class="ingedient-list-item">
                                <span class="ingedient-person-icon">&#128100;</span>
                                <div>
                                    <strong>Stagementor (Werkbegeleider)</strong>
                                    <p class="ingedient-person-sub">Je mentor bij het bedrijf moet het document eveneens ondertekenen.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="ingedient-note">
                        <p>Je ontvangt een melding zodra alle partijen het document hebben ondertekend.</p>
                    </div>
                </div>

            </main>

        </div>
    `;
}
