import './aanpassen.css';

export function renderAanpassen(container, userName = '[Studentnaam]', feedback = null) {
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
            </div>
        </div>
    `;
}
