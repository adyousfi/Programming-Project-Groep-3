import './stagedetails.css';

export async function renderStagedetails(container, userName = 'Jan Janssens', stageData = null) {
    const studentNaam = stageData?.naam || 'Onbekend';
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend';
    const bedrijfAdres = stageData?.bedrijf?.adres || 'Onbekend';
    const mentorNaam = stageData?.stagementor?.naam || 'Onbekend';
    const mentorEmail = stageData?.stagementor?.email || 'Onbekend';
    const docentNaam = stageData?.docent?.naam || 'Onbekend';
    const omschrijving = stageData?.stageDetails?.omschrijving || 'Geen omschrijving beschikbaar';
    const docValidated = stageData?.document_validated || false;

    let evalAvailable = false;
    let studentSubmitted = false;
    let docentSubmitted = false;
    let finaleAvailable = false;
    let finaleStudentSubmitted = false;
    let finaleDocentSubmitted = false;
    if (docValidated && stageData?.id) {
        try {
            const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${stageData.id}`, { credentials: 'include' });
            const evalData = await evalRes.json();
            evalAvailable = evalData.bestaatDoorDocent === true;
        } catch {}
        if (evalAvailable) {
            try {
                const statusRes = await fetch(`/api/evaluaties/status?stage_id=${stageData.id}&type_evaluatie=tussentijds`, { credentials: 'include' });
                const statusData = await statusRes.json();
                studentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_student);
                docentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_docent);
            } catch {}
        }
        try {
            const finaleRes = await fetch(`/api/evaluaties/status?stage_id=${stageData.id}&type_evaluatie=finale`, { credentials: 'include' });
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

    let startDatum = 'Onbekend';
    let eindDatum = 'Onbekend';
    if (stageData?.stageDetails?.start) {
        startDatum = new Date(stageData.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (stageData?.stageDetails?.einde) {
        eindDatum = new Date(stageData.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const statusClass = stageData?.rawStatus === 'GOEDGEKEURD' ? 'status-goedgekeurd'
        : stageData?.rawStatus === 'AANVRAAG' ? 'status-in_afwachting'
        : stageData?.rawStatus === 'AFGEKEURD' ? 'status-afgekeurd'
        : stageData?.rawStatus === 'DOCUMENTGEUPLOADED' ? (docValidated ? 'status-goedgekeurd' : 'status-in_afwachting')
        : 'status-goedgekeurd';
    const statusLabel = stageData?.rawStatus === 'GOEDGEKEURD' ? 'Goedgekeurd'
        : stageData?.rawStatus === 'AANVRAAG' ? 'In afwachting'
        : stageData?.rawStatus === 'AFGEKEURD' ? 'Afgekeurd'
        : stageData?.rawStatus === 'DOCUMENTGEUPLOADED' ? (docValidated ? 'Document gevalideerd' : 'Document geüpload')
        : stageData?.rawStatus || 'Onbekend';

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
                        <a href="${docValidated ? '?role=logboek' : '#'}" class="sidebar-nav-item${docValidated ? '' : ' disabled'}">Logboek</a>
                        <a href="${docValidated && anyEvalAvailable ? '?role=evaluatie' : '#'}" class="sidebar-nav-item${docValidated && anyEvalAvailable ? '' : ' disabled'}">Evaluatie${anyNewEval ? ' <span class="sidebar-badge">Nieuw</span>' : ''}</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <main class="stagedetails-main">
                <h1 class="page-title">Stagedetails</h1>
                <span class="status-badge ${statusClass}">${statusLabel}</span>

                <div class="details-card" id="details-card">
                    <div class="detail-section">
                        <h3 class="detail-label">Student</h3>
                        <p class="detail-value">${studentNaam}</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Bedrijf</h3>
                        <p class="detail-value">${bedrijfNaam}</p>
                        <p class="detail-sub">${bedrijfAdres}</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Stagementor</h3>
                        <p class="detail-value">${mentorNaam}</p>
                        <p class="detail-sub">${mentorEmail}</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Toegewezen EhB-docent</h3>
                        <p class="detail-value">${docentNaam}</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Periode</h3>
                        <p class="detail-value">${startDatum} t/m ${eindDatum}</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Omschrijving van de opdracht</h3>
                        <p class="detail-sub">${omschrijving}</p>
                    </div>
                </div>
            </main>
        </div>
    `;
}
