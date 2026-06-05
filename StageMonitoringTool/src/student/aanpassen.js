import './aanpassen.css';

export function renderAanpassen(container, userName = '[Studentnaam]', feedback = null, proposal = null) {
    const defaultFeedback = {
        intro: 'De stage opdracht is interessant, maar er zijn enkele punten die verduidelijking nodig hebben:',
        punten: [
            'De omschrijving moet specifieker zijn over welke concrete projecten de student gaat uitvoeren.',
            'Geef meer details over de begeleiding: hoeveel tijd zal de mentor wekelijks beschikbaar zijn?',
            'Vermeld welke voorkennis vereist is.'
        ],
        conclusie: 'Pas de aanvraag aan met deze verduidelijkingen en dien opnieuw in.'
    };

    const fb = feedback || defaultFeedback;

    const defaultProposal = {
        studentNaam: 'Student placeholder',
        studentNummer: '12345678'
    };

    const p = proposal || defaultProposal;

    container.innerHTML = `
        <div class="aanpassen-modal-overlay">
            <div class="aanpassen-modal">
                <!-- Header -->
                <div class="aanpassen-header">
                    <h2 class="aanpassen-title">Stage Aanvraag Aanpassen</h2>
                    <button class="aanpassen-close-btn" title="Sluiten">&times;</button>
                </div>

                <!-- Feedback Section -->
                <div class="aanpassen-feedback">
                    <h3 class="aanpassen-feedback-title">Feedback van Stagecommissie:</h3>
                    <p class="aanpassen-feedback-intro">${fb.intro}</p>
                    <ol class="aanpassen-feedback-list">
                        ${fb.punten.map(punt => `<li>${punt}</li>`).join('')}
                    </ol>
                    <p class="aanpassen-feedback-conclusie">${fb.conclusie}</p>
                </div>

                <!-- Form Body -->
                <div class="aanpassen-form-body">
                    <!-- Studentgegevens -->
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Studentgegevens</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="student-naam">Naam *</label>
                                <input type="text" id="student-naam" value="${p.studentNaam}" readonly>
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="student-nummer">Studentnummer *</label>
                                <input type="number" id="student-nummer" value="${p.studentNummer}" readonly>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
