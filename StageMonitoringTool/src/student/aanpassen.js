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
        studentNaam: 'Jan Janssens',
        studentNummer: '12345678',
        bedrijfNaam: 'TechCorp Belgium',
        bedrijfAdres: 'Innovation Street 42, 1050 Brussels',
        mentorNaam: 'Mieke Peeters',
        mentorEmail: 'mieke.peeters@techcorp.be',
        opdrachtOmschrijving: 'De stagiair zal werken aan het ontwikkelen van frontend applicaties met React en TypeScript. Focus op moderne webontwikkeling en samenwerking in een professioneel team.',
        periodeStart: '2026-03-02',
        periodeEind: '2026-05-30'
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

                    <!-- Bedrijfsgegevens -->
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Bedrijfsgegevens</h3>
                        <div class="aanpassen-form-group">
                            <label for="bedrijf-naam">Bedrijfsnaam *</label>
                            <input type="text" id="bedrijf-naam" value="${p.bedrijfNaam}" readonly>
                        </div>
                        <div class="aanpassen-form-group">
                            <label for="bedrijf-adres">Adres *</label>
                            <input type="text" id="bedrijf-adres" value="${p.bedrijfAdres}" readonly>
                        </div>
                    </div>

                    <!-- Stagementor / Werkbegeleider -->
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Stagementor / Werkbegeleider</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="mentor-naam">Naam *</label>
                                <input type="text" id="mentor-naam" value="${p.mentorNaam}" readonly>
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="mentor-email">E-mail *</label>
                                <input type="email" id="mentor-email" value="${p.mentorEmail}" readonly>
                            </div>
                        </div>
                    </div>

                    <!-- Omschrijving van de opdracht -->
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Omschrijving van de opdracht</h3>
                        <div class="aanpassen-form-group">
                            <textarea id="opdracht-omschrijving" rows="5">${p.opdrachtOmschrijving}</textarea>
                        </div>
                    </div>

                    <!-- Periode van de stage -->
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Periode van de stage</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="periode-start">Startdatum *</label>
                                <input type="date" id="periode-start" value="${p.periodeStart}">
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="periode-eind">Einddatum *</label>
                                <input type="date" id="periode-eind" value="${p.periodeEind}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="aanpassen-footer">
                    <button type="button" class="aanpassen-btn-submit">Aangepaste Aanvraag Indienen</button>
                    <button type="button" class="aanpassen-btn-cancel">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    const closeBtn = container.querySelector('.aanpassen-close-btn');
    const cancelBtn = container.querySelector('.aanpassen-btn-cancel');
    const submitBtn = container.querySelector('.aanpassen-btn-submit');

    const goToFeedback = () => {
        window.location.href = '/?role=feedback';
    };

    const goToWachten = () => {
        window.location.href = '/?role=wachten';
    };

    if (closeBtn) closeBtn.addEventListener('click', goToFeedback);
    if (cancelBtn) cancelBtn.addEventListener('click', goToFeedback);
    if (submitBtn) submitBtn.addEventListener('click', goToWachten);
}
