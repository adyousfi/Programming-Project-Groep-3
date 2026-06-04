import './formulier.css';

export function renderStageformulier(container) {
    container.innerHTML = `
        <div class="form-page-wrapper">
            <div class="form-container">
                <div class="form-header">
                    <h2 class="form-title">Stagevoorstel Indienen</h2>
                    <button class="form-close-btn" title="Terug naar dashboard">&times;</button>
                </div>
                
                <div class="form-body">
                    <div class="form-section">
                        <h3 class="section-title">Studentgegevens</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="student-naam">Naam *</label>
                                <input type="text" id="student-naam" value="">
                            </div>
                            <div class="form-group">
                                <label for="student-nummer">Studentnummer *</label>
                                <input type="text" id="student-nummer" value="">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Bedrijfsgegevens</h3>
                        <div class="form-group">
                            <label for="bedrijf-naam">Bedrijfsnaam *</label>
                            <input type="text" id="bedrijf-naam" value="">
                        </div>
                        <div class="form-group">
                            <label for="bedrijf-adres">Adres *</label>
                            <input type="text" id="bedrijf-adres" value="">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Stagementor / Werkbegeleider</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="mentor-naam">Naam *</label>
                                <input type="text" id="mentor-naam" value="">
                            </div>
                            <div class="form-group">
                                <label for="mentor-email">E-mail *</label>
                                <input type="text" id="mentor-email" value="">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Omschrijving van de opdracht</h3>
                        <div class="form-group">
                            <textarea id="opdracht-omschrijving" rows="4"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Periode van de stage</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="periode-start">Startdatum *</label>
                                <input type="text" id="periode-start" value="">
                            </div>
                            <div class="form-group">
                                <label for="periode-eind">Einddatum *</label>
                                <input type="text" id="periode-eind" value="">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-footer">
                    <button class="btn-primary">Indienen</button>
                    <button class="btn-secondary">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    // Sluit functionaliteit (Terug naar student dashboard)
    const goBack = () => {
        window.location.search = '?role=student';
    };

    const closeBtn = container.querySelector('.form-close-btn');
    const cancelBtn = container.querySelector('.btn-secondary');
    
    if (closeBtn) closeBtn.addEventListener('click', goBack);
    if (cancelBtn) cancelBtn.addEventListener('click', goBack);
}
