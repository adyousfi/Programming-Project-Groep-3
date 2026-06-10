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
                        <!-- Velden komen hier -->
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Bedrijfsgegevens</h3>
                        <!-- Velden komen hier -->
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Stagementor / Werkbegeleider</h3>
                        <!-- Velden komen hier -->
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Omschrijving van de opdracht</h3>
                        <!-- Velden komen hier -->
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Periode van de stage</h3>
                        <!-- Velden komen hier -->
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
