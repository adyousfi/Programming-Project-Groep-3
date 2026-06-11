import './stagedetails.css';

export function renderStagedetails(container, userName = 'Jan Janssens', stageData = null) {
    const studentNaam = stageData?.naam || 'Onbekend';
    const studentNummer = stageData?.studentNummer || 'Onbekend';
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend';
    const bedrijfAdres = stageData?.bedrijf?.adres || 'Onbekend';
    const mentorNaam = stageData?.stagementor?.naam || 'Onbekend';
    const mentorEmail = stageData?.stagementor?.email || 'Onbekend';
    const docentNaam = stageData?.docent?.naam || 'Onbekend';
    const omschrijving = stageData?.stageDetails?.omschrijving || 'Geen omschrijving beschikbaar';

    let startDatum = 'Onbekend';
    let eindDatum = 'Onbekend';
    if (stageData?.stageDetails?.start) {
        startDatum = new Date(stageData.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (stageData?.stageDetails?.einde) {
        eindDatum = new Date(stageData.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const statusClass = stageData?.rawStatus === 'Goedgekeurd' ? 'status-goedgekeurd'
        : stageData?.rawStatus === 'Aanvraag' ? 'status-in_afwachting'
        : stageData?.rawStatus === 'Afgekeurd' ? 'status-afgekeurd'
        : 'status-goedgekeurd';
    const statusLabel = stageData?.rawStatus === 'Goedgekeurd' ? 'Goedgekeurd'
        : stageData?.rawStatus === 'Aanvraag' ? 'In afwachting'
        : stageData?.rawStatus === 'Afgekeurd' ? 'Afgekeurd'
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
                <span class="status-badge ${statusClass}">${statusLabel}</span>

                <div class="details-card" id="details-card">
                    <div class="detail-section">
                        <h3 class="detail-label">Student</h3>
                        <p class="detail-value">${studentNaam}</p>
                        <p class="detail-sub">Studentnummer: ${studentNummer}</p>
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
