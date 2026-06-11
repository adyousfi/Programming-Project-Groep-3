import './stagedetails.css';

export function renderStagedetails(container, userName = 'Jan Janssens') {
    container.innerHTML = `
        <div class="stagedetails-layout">
            <aside class="stagedetails-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="?role=goedgekeurd_student" class="sidebar-nav-item">Overzicht</a>
                        <a href="?role=stagedetails" class="sidebar-nav-item active">Stagedetails</a>
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

            <main class="stagedetails-main">
                <h1 class="page-title">Stagedetails</h1>
                <span class="status-badge status-goedgekeurd">Goedgekeurd</span>

                <div class="details-card" id="details-card">
                </div>
            </main>
        </div>
    `;
}
