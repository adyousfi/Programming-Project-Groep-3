import './documenten.css';

export function renderDocumenten(container, userName = 'Jan Janssens') {
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
                        <a href="?role=documenten" class="sidebar-nav-item active">Documenten</a>
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

                <!-- Stageovereenkomst Card -->
                <div class="document-card">
                    <div class="document-card-header">
                        <h2 class="document-card-title">Stageovereenkomst</h2>
                        <span class="document-status-badge">Ondertekend</span>
                    </div>
                    <p class="document-card-subtitle">Officieel document tussen student, bedrijf en school</p>
                    <hr class="document-card-divider">
                    <p class="document-card-description">De stageovereenkomst is opgesteld en ondertekend door alle partijen. Dit document wordt beheerd door de stageco&ouml;rdinator.</p>
                    <button class="document-download-btn">Download Overeenkomst</button>
                </div>

            </main>

        </div>
    `;
}
