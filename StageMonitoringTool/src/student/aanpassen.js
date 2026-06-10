import './aanpassen.css';
import { getActiveProposalId, getProposalById } from './dataService.js';

export async function renderAanpassen(container, userName = '[Studentnaam]') {
    container.innerHTML = `<div class="aanpassen-modal-overlay"><div class="aanpassen-modal"><p>Gegevens laden...</p></div></div>`;

    const activeId = getActiveProposalId();
    if (!activeId) {
        container.innerHTML = `<div class="aanpassen-modal-overlay"><div class="aanpassen-modal">
            <p>Geen actief voorstel gevonden. Ga terug naar het dashboard.</p>
            <button onclick="window.location.href='/?role=student'">Terug naar dashboard</button>
        </div></div>`;
        return;
    }

    const proposal = await getProposalById(activeId);
    if (!proposal) {
        container.innerHTML = `<div class="aanpassen-modal-overlay"><div class="aanpassen-modal">
            <p>Voorstel niet gevonden. Ga terug naar het dashboard.</p>
            <button onclick="window.location.href='/?role=student'">Terug naar dashboard</button>
        </div></div>`;
        return;
    }

    const fb = proposal.feedback || {
        intro: 'Er is feedback gegeven op je stagevoorstel.',
        punten: ['Verwerk de opmerkingen van de stagecommissie.'],
        conclusie: 'Pas de aanvraag aan en dien opnieuw in.'
    };

    container.innerHTML = `
        <div class="aanpassen-modal-overlay">
            <div class="aanpassen-modal">
                <div class="aanpassen-header">
                    <h2 class="aanpassen-title">Stage Aanvraag Aanpassen</h2>
                    <button class="aanpassen-close-btn" title="Sluiten">&times;</button>
                </div>

                <div class="aanpassen-feedback">
                    <h3 class="aanpassen-feedback-title">Feedback van Stagecommissie:</h3>
                    <p class="aanpassen-feedback-intro">${fb.intro}</p>
                    <ol class="aanpassen-feedback-list">
                        ${fb.punten.map(punt => `<li>${punt}</li>`).join('')}
                    </ol>
                    <p class="aanpassen-feedback-conclusie">${fb.conclusie}</p>
                </div>

                <div class="aanpassen-form-body">
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Studentgegevens</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="student-naam">Naam *</label>
                                <input type="text" id="student-naam" value="${proposal.studentNaam}" readonly>
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="student-nummer">Studentnummer *</label>
                                <input type="number" id="student-nummer" value="${proposal.studentNummer}" readonly>
                            </div>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Bedrijfsgegevens</h3>
                        <div class="aanpassen-form-group">
                            <label for="bedrijf-naam">Bedrijfsnaam *</label>
                            <input type="text" id="bedrijf-naam" value="${proposal.bedrijfNaam}" readonly>
                        </div>
                        <div class="aanpassen-form-group">
                            <label for="bedrijf-adres">Adres *</label>
                            <input type="text" id="bedrijf-adres" value="${proposal.bedrijfAdres}" readonly>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Stagementor / Werkbegeleider</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="mentor-naam">Naam *</label>
                                <input type="text" id="mentor-naam" value="${proposal.mentorNaam}" readonly>
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="mentor-email">E-mail *</label>
                                <input type="email" id="mentor-email" value="${proposal.mentorEmail}" readonly>
                            </div>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Omschrijving van de opdracht</h3>
                        <div class="aanpassen-form-group">
                            <textarea id="opdracht-omschrijving" rows="5">${proposal.opdrachtOmschrijving}</textarea>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Periode van de stage</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="periode-start">Startdatum *</label>
                                <input type="date" id="periode-start" value="${proposal.periodeStart}">
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="periode-eind">Einddatum *</label>
                                <input type="date" id="periode-eind" value="${proposal.periodeEind}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aanpassen-footer">
                    <button type="button" class="aanpassen-btn-submit">Aangepaste Aanvraag Indienen</button>
                    <button type="button" class="aanpassen-btn-cancel">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    const closeBtn = container.querySelector('.aanpassen-close-btn');
    const cancelBtn = container.querySelector('.aanpassen-btn-cancel');
    const submitBtn = container.querySelector('.aanpassen-btn-submit');

    const goToFeedback = () => {
        window.location.href = '/?role=feedback';
    };

    if (closeBtn) closeBtn.addEventListener('click', goToFeedback);
    if (cancelBtn) cancelBtn.addEventListener('click', goToFeedback);

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const omschrijving = container.querySelector('#opdracht-omschrijving').value.trim();
            const start = container.querySelector('#periode-start').value;
            const eind = container.querySelector('#periode-eind').value;

            if (!omschrijving || !start || !eind) {
                alert('Vul alle verplichte velden in.');
                return;
            }

            submitBtn.disabled = true;
            // Update localStorage immediately
            try {
                const raw = localStorage.getItem('stagevoorstellen_mock');
                const proposals = raw ? JSON.parse(raw) : [];
                const index = proposals.findIndex(p => p.id === activeId);
                if (index !== -1) {
                    proposals[index] = { ...proposals[index], opdrachtOmschrijving: omschrijving, periodeStart: start, periodeEind: eind, status: 'wachten', feedback: null, laatstBewerktOp: new Date().toISOString() };
                    localStorage.setItem('stagevoorstellen_mock', JSON.stringify(proposals, null, 2));
                }
            } catch (e) {
                // ignore localStorage errors
            }
            window.location.href = '/?role=wachten';
            // Update server in background (non-blocking)
            fetch(`/api/proposals/${encodeURIComponent(activeId)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opdrachtOmschrijving: omschrijving, periodeStart: start, periodeEind: eind, status: 'wachten', feedback: null }),
            }).catch(() => {});
        });
    }
}
