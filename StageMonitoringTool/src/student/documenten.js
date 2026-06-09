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

                <!-- Stageovereenkomst Upload Card -->
                <div class="document-card">
                    <div class="document-card-header">
                        <h2 class="document-card-title">Stageovereenkomst</h2>
                        <span class="document-status-badge badge-wachtend">Nog niet geuploadd</span>
                    </div>
                    <p class="document-card-subtitle">Officieel document tussen student, bedrijf en school</p>
                    <hr class="document-card-divider">
                    <p class="document-card-description">Upload de ondertekende stageovereenkomst hier. Het document moet ondertekend zijn door alle partijen (student, bedrijf en school).</p>

                    <div class="upload-zone" id="upload-zone">
                        <div class="upload-icon">&#128194;</div>
                        <p class="upload-text">Sleep je bestand hierheen of klik om te selecteren</p>
                        <p class="upload-subtext">PDF, JPG of PNG — max. 10MB</p>
                        <input type="file" id="file-input" class="upload-file-input" accept=".pdf,.jpg,.jpeg,.png">
                        <button class="upload-btn" id="upload-btn">Bestand Selecteren</button>
                    </div>

                    <div class="upload-selected" id="upload-selected" style="display: none;">
                        <span class="upload-filename" id="upload-filename"></span>
                        <button class="upload-remove-btn" id="upload-remove-btn">Verwijderen</button>
                    </div>

                    <button class="upload-submit-btn" id="upload-submit-btn" style="display: none;">Document Indienen</button>
                </div>

            </main>

        </div>
    `;
}
