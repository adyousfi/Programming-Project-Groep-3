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
                    <div class="detail-section">
                        <h3 class="detail-label">Student</h3>
                        <p class="detail-value" id="detail-student-naam">Jan Janssens</p>
                        <p class="detail-sub" id="detail-student-nummer">Studentnummer: 12345678</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Bedrijf</h3>
                        <p class="detail-value" id="detail-bedrijf-naam">TechCorp Belgium</p>
                        <p class="detail-sub" id="detail-bedrijf-adres">Innovation Street 42, 1050 Brussels</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Stagementor</h3>
                        <p class="detail-value" id="detail-mentor-naam">Mieke Peeters</p>
                        <p class="detail-sub" id="detail-mentor-email">mieke.peeters@techcorp.be</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Toegewezen EhB-docent</h3>
                        <p class="detail-value" id="detail-docent-naam">Prof. Sarah Claes</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Periode</h3>
                        <p class="detail-value" id="detail-periode">3 feb 2026 t/m 30 mei 2026</p>
                    </div>

                    <div class="detail-section">
                        <h3 class="detail-label">Omschrijving van de opdracht</h3>
                        <p class="detail-sub" id="detail-omschrijving">De stagair zal werken aan het ontwikkelen van frontend applicaties met React en TypeScript. Focus op moderne webontwikkeling en samenwerking in een professioneel team.</p>
                    </div>
                </div>
            </main>
        </div>
    `;
}
