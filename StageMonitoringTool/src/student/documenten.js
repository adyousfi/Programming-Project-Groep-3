import './documenten.css';

export async function renderDocumenten(container) {
    let userName = 'Student';
    let adminDocs = [];
    let studentDocs = [];
    let docValidated = false;
    try {
        const [docsRes, meRes] = await Promise.all([
            fetch('/api/documents/mijn', { credentials: 'include' }),
            fetch('/me', { credentials: 'include' })
        ]);
        const docs = await docsRes.json();
        const meData = await meRes.json();
        if (meData.loggedIn && meData.user) {
            userName = meData.user.last_name && meData.user.first_name
                ? `${meData.user.last_name.toUpperCase()} ${meData.user.first_name}`
                : meData.user.first_name || 'Student';
        }
        if (Array.isArray(docs)) {
            adminDocs = docs.filter(d => d.type === 'admin_template');
            studentDocs = docs.filter(d => d.type === 'student_submission');
        }
        if (meData.loggedIn && meData.user && meData.user.user_id) {
            const stageRes = await fetch(`/api/stages/student/${meData.user.user_id}`, { credentials: 'include' });
            const stageData = await stageRes.json();
            docValidated = stageData.document_validated || false;
        }
    } catch {}

    const hasAdminDoc = adminDocs.length > 0;
    const hasStudentSubmission = studentDocs.length > 0;

    if (hasStudentSubmission && !docValidated) {
        window.location.href = '/?role=documenten_ingedient';
        return;
    }

    container.innerHTML = `
        <div class="documenten-layout">

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
                        <a href="${docValidated ? '?role=logboek' : '#'}" class="sidebar-nav-item${docValidated ? '' : ' disabled'}">Logboek</a>
                        <a href="#" class="sidebar-nav-item disabled">Evaluatie</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <main class="documenten-main">

                <h1 class="page-title">Documenten</h1>

                <!-- Stap 1: Document van school downloaden -->
                <div class="document-card">
                    <div class="document-card-header">
                        <h2 class="document-card-title">Document van school</h2>
                        ${hasAdminDoc
                            ? `<span class="document-status-badge badge-beschikbaar">Beschikbaar</span>`
                            : `<span class="document-status-badge badge-wachtend">Wacht op school</span>`
                        }
                    </div>
                    <p class="document-card-subtitle">Download dit document, vul het in en dien het hieronder in</p>
                    <hr class="document-card-divider">

                    ${hasAdminDoc ? `
                        <div class="doc-list">
                            ${adminDocs.map(d => `
                                <div class="doc-list-item">
                                    <span class="doc-file-icon">&#128196;</span>
                                    <span class="doc-file-name">${d.name}</span>
                                    <span class="doc-file-date">${d.datum}</span>
                                    <a href="/api/documents/${d.id}/download" class="doc-download-btn" download>Downloaden</a>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="document-card-description">
                            De school heeft nog geen document voor jou klaarstaan. Je ontvangt een melding zodra dit beschikbaar is.
                        </p>
                    `}
                </div>

                <!-- Stap 2: Ingevuld document terugsturen -->
                <div class="document-card" ${!hasAdminDoc ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
                    <div class="document-card-header">
                        <h2 class="document-card-title">Ingevuld document indienen</h2>
                        ${docValidated
                            ? `<span class="document-status-badge badge-gevalideerd">Gevalideerd</span>`
                            : hasStudentSubmission
                                ? `<span class="document-status-badge badge-ingediend">Ingediend</span>`
                                : `<span class="document-status-badge badge-wachtend">Nog niet ingediend</span>`
                        }
                    </div>
                    ${docValidated
                        ? `<p class="document-card-subtitle">Je document is succesvol gevalideerd door de admin</p>`
                        : `<p class="document-card-subtitle">Upload hier het ingevulde document terug naar de school</p>`
                    }
                    <hr class="document-card-divider">

                    ${docValidated ? `
                        <div class="doc-list">
                            ${studentDocs.map(d => `
                                <div class="doc-list-item">
                                    <span class="doc-file-icon">&#10003;</span>
                                    <span class="doc-file-name">${d.name}</span>
                                    <span class="doc-file-date">${d.datum}</span>
                                    <a href="/api/documents/${d.id}/download" class="doc-download-btn" download>Bekijken</a>
                                </div>
                            `).join('')}
                        </div>
                    ` : hasStudentSubmission ? `
                        <div class="doc-list" style="margin-bottom:16px;">
                            ${studentDocs.map(d => `
                                <div class="doc-list-item">
                                    <span class="doc-file-icon">&#10003;</span>
                                    <span class="doc-file-name">${d.name}</span>
                                    <span class="doc-file-date">${d.datum}</span>
                                    <a href="/api/documents/${d.id}/download" class="doc-download-btn" download>Bekijken</a>
                                </div>
                            `).join('')}
                        </div>
                        <p class="document-card-description">Wil je een nieuw document indienen? Selecteer hieronder een bestand.</p>
                    ` : `
                        <p class="document-card-description">
                            Download eerst het document hierboven, vul het in, en upload het hier terug.
                        </p>
                    `}

                    ${!docValidated ? `
                    <div class="upload-zone" id="upload-zone">
                        <div class="upload-icon">&#128194;</div>
                        <p class="upload-text">Sleep je bestand hierheen of klik om te selecteren</p>
                        <p class="upload-subtext">PDF, DOCX — max. 10MB</p>
                        <input type="file" id="file-input" class="upload-file-input" accept=".pdf,.doc,.docx">
                        <button type="button" class="upload-btn" id="upload-btn">Bestand Selecteren</button>
                    </div>

                    <div class="upload-error" id="upload-error" style="display: none;">
                        <span class="upload-error-text" id="upload-error-text"></span>
                    </div>

                    <div class="upload-selected" id="upload-selected" style="display:none;">
                        <span class="upload-filename" id="upload-filename"></span>
                        <button type="button" class="upload-remove-btn" id="upload-remove-btn">Verwijderen</button>
                    </div>

                    <button type="button" class="upload-submit-btn" id="upload-submit-btn" style="display:none;">Document Indienen</button>
                    ` : ''}
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
    let selectedFile = null;

    function validateFile(file) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Bestandstype niet toegestaan. Alleen PDF, JPG en PNG zijn toegestaan.' };
        }
        if (file.size > maxSize) {
            return { valid: false, error: 'Bestand is te groot. Maximale grootte is 10MB.' };
        }
        return { valid: true, error: null };
    }

    function showError(message) {
        const errorDiv = container.querySelector('#upload-error');
        const errorText = container.querySelector('#upload-error-text');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideError() {
        const errorDiv = container.querySelector('#upload-error');
        errorDiv.style.display = 'none';
    }

    function showFile(file) {
        const result = validateFile(file);
        if (!result.valid) {
            resetUpload();
            showError(result.error);
            return;
        }
        hideError();
        selectedFile = file;
        uploadFilename.textContent = file.name;
        uploadZone.style.display = 'none';
        uploadSelected.style.display = 'flex';
        uploadSubmitBtn.style.display = 'inline-block';
    }

    function resetUpload() {
        fileInput.value = '';
        selectedFile = null;
        uploadZone.style.display = '';
        uploadSelected.style.display = 'none';
        uploadSubmitBtn.style.display = 'none';
        hideError();
    }

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
    fileInput.addEventListener('change', () => { if (fileInput.files.length > 0) showFile(fileInput.files[0]); });

    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) showFile(e.dataTransfer.files[0]);
    });

    uploadRemoveBtn.addEventListener('click', resetUpload);

    uploadSubmitBtn.addEventListener('click', async () => {
        if (!fileInput.files[0]) return;
        uploadSubmitBtn.disabled = true;
        uploadSubmitBtn.textContent = 'Bezig met uploaden...';

        const formData = new FormData();
        formData.append('document', fileInput.files[0]);

        try {
            const res = await fetch('/api/documents/student-upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert('Fout bij indienen: ' + (err.msg || res.status));
                uploadSubmitBtn.disabled = false;
                uploadSubmitBtn.textContent = 'Document Indienen';
                return;
            }
        } catch {
            alert('Geen verbinding met de server. Probeer opnieuw.');
            uploadSubmitBtn.disabled = false;
            uploadSubmitBtn.textContent = 'Document Indienen';
            return;
        }

        if (!selectedFile) {
            showError('Geen bestand geselecteerd.');
            return;
        }
        const result = validateFile(selectedFile);
        if (!result.valid) {
            resetUpload();
            showError(result.error);
            return;
        }
        window.location.href = '/?role=documenten_ingedient';
    });
}
