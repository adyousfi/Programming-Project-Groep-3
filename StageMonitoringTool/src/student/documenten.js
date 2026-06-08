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
                        <a href="?role=overzicht" class="sidebar-nav-item">Overzicht</a>
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

                <!-- Preview Modus Bar -->
                <div class="preview-bar">
                    <span class="preview-bar-label">Preview Modus:</span>
                    <div class="preview-bar-buttons">
                        <a href="#" class="preview-bar-btn">Stagevoorstel indienen</a>
                        <a href="#" class="preview-bar-btn">Aanpassingen vereist</a>
                        <a href="#" class="preview-bar-btn active">Goedgekeurd</a>
                    </div>
                </div>

            </main>

        </div>
    `;
}
