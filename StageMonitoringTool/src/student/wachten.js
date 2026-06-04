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
                    <a href="/?role=student" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud (volgende stap) -->
            <main class="wachten-main">
                <p style="padding: 2rem;">Hoofdinhoud komt hier...</p>
            </main>

        </div>
    `;
}
