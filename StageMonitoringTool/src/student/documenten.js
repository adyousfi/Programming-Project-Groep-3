import './documenten.css';

export async function renderDocumenten(container) {
    let userName = 'Student';
    let adminDocs = [];
    let studentDocs = [];
    let docValidated = false;
    let stageId = null;
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
            stageId = stageData.id || null;
        }
    } catch {}

    let evalAvailable = false;
    let studentSubmitted = false;
    let docentSubmitted = false;
    let finaleAvailable = false;
    let finaleStudentSubmitted = false;
    let finaleDocentSubmitted = false;
    if (docValidated && stageId) {
        try {
            const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${stageId}`, { credentials: 'include' });
            const evalData = await evalRes.json();
            evalAvailable = evalData.bestaatDoorDocent === true;
        } catch {}
        if (evalAvailable) {
            try {
                const statusRes = await fetch(`/api/evaluaties/status?stage_id=${stageId}&type_evaluatie=tussentijds`, { credentials: 'include' });
                const statusData = await statusRes.json();
                studentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_student);
                docentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_docent);
            } catch {}
        }
        try {
            const finaleRes = await fetch(`/api/evaluaties/status?stage_id=${stageId}&type_evaluatie=finale`, { credentials: 'include' });
            const finaleStatusData = await finaleRes.json();
            finaleAvailable = finaleStatusData.bestaat === true
                && finaleStatusData.evaluaties && finaleStatusData.evaluaties.length > 0
                && finaleStatusData.evaluaties.some((e) => e.docent_id != null);
            if (finaleAvailable) {
                finaleStudentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_student);
                finaleDocentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_docent);
            }
        } catch {}
    }
    const anyEvalAvailable = evalAvailable || finaleAvailable;
    const anyNewEval = (evalAvailable && (!studentSubmitted || docentSubmitted))
        || (finaleAvailable && (!finaleStudentSubmitted || finaleDocentSubmitted));

    const hasAdminDoc = adminDocs.length > 0;
    const hasStudentSubmission = studentDocs.length > 0;

    if (hasStudentSubmission && !docValidated) {
        window.location.href = '/documenten-ingediend';
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
                        <a href="${docValidated && anyEvalAvailable ? '?role=evaluatie' : '#'}" class="sidebar-nav-item${docValidated && anyEvalAvailable ? '' : ' disabled'}">Evaluatie${anyNewEval ? ' <span class="sidebar-badge">Nieuw</span>' : ''}</a>
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
                                    <div class="doc-actions">
                                        <a href="/api/documents/${d.id}/download" class="doc-download-btn" download>Downloaden</a>
                                        ${!docValidated ? `<button type="button" class="doc-sign-btn" data-doc-id="${d.id}">Onderteken in app</button>` : ''}
                                    </div>
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

        <div id="sign-modal" class="modal-overlay" style="display:none;">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>Document Digitaal Ondertekenen</h3>
                    <button id="close-sign-modal" class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom:16px; font-size:14px; color:#4b5563;">
                        Teken hieronder met uw muis of vinger. Uw handtekening wordt automatisch onderaan het document toegevoegd.
                    </p>
                    <div class="canvas-wrapper">
                        <canvas id="student-sig-canvas" width="600" height="200"></canvas>
                        <div class="canvas-placeholder" id="student-canvas-placeholder">Teken hier uw handtekening</div>
                    </div>
                    <p id="sign-error" style="color:red; font-size:13px; margin-top:10px; display:none;"></p>
                </div>
                <div class="modal-footer">
                    <button id="clear-sig-btn" class="btn-clear">Wissen</button>
                    <button id="submit-sig-btn" class="btn-submit" disabled>Ondertekenen en Indienen</button>
                </div>
            </div>
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
        window.location.href = '/documenten-ingediend';
    });

    // --- Sign Modal Logic ---
    const signModal = container.querySelector('#sign-modal');
    const closeSignModal = container.querySelector('#close-sign-modal');
    const studentSigCanvas = container.querySelector('#student-sig-canvas');
    const sigPlaceholder = container.querySelector('#student-canvas-placeholder');
    const clearSigBtn = container.querySelector('#clear-sig-btn');
    const submitSigBtn = container.querySelector('#submit-sig-btn');
    const signError = container.querySelector('#sign-error');
    
    let activeDocId = null;
    let isDrawing = false;
    let hasSignature = false;
    let ctx = null;

    if (studentSigCanvas) {
        ctx = studentSigCanvas.getContext('2d');
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        studentSigCanvas.width = studentSigCanvas.offsetWidth * ratio;
        studentSigCanvas.height = 200 * ratio;
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        function getPos(e) {
            const rect = studentSigCanvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        const startDrawing = (e) => {
            e.preventDefault();
            isDrawing = true;
            hasSignature = true;
            sigPlaceholder.style.opacity = '0';
            submitSigBtn.disabled = false;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            isDrawing = false;
            ctx.closePath();
        };

        studentSigCanvas.addEventListener('mousedown', startDrawing);
        studentSigCanvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);

        studentSigCanvas.addEventListener('touchstart', startDrawing, { passive: false });
        studentSigCanvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDrawing);

        clearSigBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, studentSigCanvas.width, studentSigCanvas.height);
            hasSignature = false;
            submitSigBtn.disabled = true;
            sigPlaceholder.style.opacity = '1';
            signError.style.display = 'none';
        });

        submitSigBtn.addEventListener('click', async () => {
            if (!hasSignature || !activeDocId) return;
            submitSigBtn.disabled = true;
            submitSigBtn.textContent = 'Bezig met opslaan...';
            signError.style.display = 'none';

            const signatureData = studentSigCanvas.toDataURL('image/png');

            try {
                const res = await fetch(`/api/documents/student-sign/${activeDocId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ signature: signatureData })
                });

                if (res.ok) {
                    window.location.href = '/documenten-ingediend';
                } else {
                    const data = await res.json().catch(() => ({}));
                    signError.textContent = data.msg || 'Fout bij opslaan handtekening.';
                    signError.style.display = 'block';
                    submitSigBtn.disabled = false;
                    submitSigBtn.textContent = 'Ondertekenen en Indienen';
                }
            } catch {
                signError.textContent = 'Netwerkfout. Probeer het opnieuw.';
                signError.style.display = 'block';
                submitSigBtn.disabled = false;
                submitSigBtn.textContent = 'Ondertekenen en Indienen';
            }
        });
    }

    // Open modal
    const signBtns = container.querySelectorAll('.doc-sign-btn');
    signBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeDocId = btn.getAttribute('data-doc-id');
            signModal.style.display = 'flex';
            if (ctx) {
                // Now that the modal is visible, we can safely compute dimensions
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                studentSigCanvas.width = studentSigCanvas.offsetWidth * ratio;
                studentSigCanvas.height = 200 * ratio;
                ctx.scale(ratio, ratio);
                ctx.strokeStyle = '#1e40af';
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.clearRect(0, 0, studentSigCanvas.width, studentSigCanvas.height);
                hasSignature = false;
                submitSigBtn.disabled = true;
                sigPlaceholder.style.opacity = '1';
                signError.style.display = 'none';
            }
        });
    });

    closeSignModal?.addEventListener('click', () => {
        signModal.style.display = 'none';
        activeDocId = null;
    });
}
