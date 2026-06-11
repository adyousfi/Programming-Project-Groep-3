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
                        <button type="button" class="upload-btn" id="upload-btn">Bestand Selecteren</button>
                    </div>

                    <div class="upload-error" id="upload-error" style="display: none;">
                        <span class="upload-error-text" id="upload-error-text"></span>
                    </div>

                    <div class="upload-selected" id="upload-selected" style="display: none;">
                        <span class="upload-filename" id="upload-filename"></span>
                        <button type="button" class="upload-remove-btn" id="upload-remove-btn">Verwijderen</button>
                    </div>

                    <button type="button" class="upload-submit-btn" id="upload-submit-btn" style="display: none;">Document Indienen</button>
                </div>

                <div class="download-template">
                    <p class="download-template-text">Nog geen stageovereenkomst? Download eerst het template, vul het in, en upload het hier terug.</p>
                    <a href="/templates/stageovereenkomst.pdf" download class="download-template-btn">Download Template</a>
                </div>

            </main>

        </div>
    `;

    const uploadZone = container.querySelector('#upload-zone');
    const fileInput = container.querySelector('#file-input');
    const uploadBtn = container.querySelector('#upload-btn');
    const uploadSelected = container.querySelector('#upload-selected');
    const uploadFilename = container.querySelector('#upload-filename');
    const uploadRemoveBtn = container.querySelector('#upload-remove-btn');
    const uploadSubmitBtn = container.querySelector('#upload-submit-btn');
    const badge = container.querySelector('.document-status-badge');

    function showFile(file) {
        uploadFilename.textContent = file.name;
        uploadZone.style.display = 'none';
        uploadSelected.style.display = 'flex';
        uploadSubmitBtn.style.display = 'inline-block';
    }

    function resetUpload() {
        fileInput.value = '';
        uploadZone.style.display = '';
        uploadSelected.style.display = 'none';
        uploadSubmitBtn.style.display = 'none';
    }

    // Click op upload zone → open file picker
    uploadZone.addEventListener('click', () => fileInput.click());

    // Click op "Bestand Selecteren" button
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    // Bestand geselecteerd via file picker
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            showFile(fileInput.files[0]);
        }
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            showFile(e.dataTransfer.files[0]);
        }
    });

    // Verwijder bestand
    uploadRemoveBtn.addEventListener('click', () => resetUpload());

    // Document indienen
    uploadSubmitBtn.addEventListener('click', () => {
        window.location.href = '/?role=documenten_ingedient';
    });
}
