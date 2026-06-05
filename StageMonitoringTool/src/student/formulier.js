import './formulier.css';
import { saveProposal } from './dataService.js';

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
                                <input type="number" id="student-nummer" value="">
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
                                <input type="email" id="mentor-email" value="">
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
                                <input type="date" id="periode-start" value="">
                            </div>
                            <div class="form-group">
                                <label for="periode-eind">Einddatum *</label>
                                <input type="date" id="periode-eind" value="">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-footer">
                    <button type="button" class="btn-primary">Indienen</button>
                    <button type="button" class="btn-secondary">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    // Sluit functionaliteit (Terug naar student dashboard)
    const goBack = () => {
        window.location.href = '/?role=student';
    };

    const closeBtn = container.querySelector('.form-close-btn');
    const cancelBtn = container.querySelector('.btn-secondary');
    const submitBtn = container.querySelector('.btn-primary');

    if (closeBtn) closeBtn.addEventListener('click', goBack);
    if (cancelBtn) cancelBtn.addEventListener('click', goBack);

    // Validatie bij indienen
    if (submitBtn) {
        submitBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const inputs = container.querySelectorAll('input, textarea');
            let hasEmptyFields = false;
            let invalidEmail = false;
            let invalidEmailMessage = '';

            // Lijst met bekende tijdelijke domeinen (blokkeerlijst)
            const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];

            inputs.forEach(input => {
                const val = input.value.trim();

                if (val === '') {
                    hasEmptyFields = true;
                    input.style.borderColor = '#dc3545'; // Maak de rand rood
                } else {
                    input.style.borderColor = '#ced4da'; // Herstel de originele randkleur

                    // Specifieke E-mail Validatie
                    if (input.id === 'mentor-email') {
                        // 1. Basis regular expression voor een correct email formaat (iets@iets.iets)
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(val)) {
                            invalidEmail = true;
                            invalidEmailMessage = 'Ongeldig e-mailformaat.';
                            input.style.borderColor = '#dc3545';
                        } else {
                            // 2. Blokkeer tijdelijke domeinen
                            const domain = val.split('@')[1].toLowerCase();
                            if (blockedDomains.includes(domain)) {
                                invalidEmail = true;
                                invalidEmailMessage = 'Tijdelijke e-mailadressen zijn niet toegestaan.';
                                input.style.borderColor = '#dc3545';
                            }
                        }
                    }
                }
            });

            // Conditional checks voor leeg fields
            if (hasEmptyFields) {
                alert('Ho even! Je bent gestopt. Zorg ervoor dat alle verplichte velden zijn ingevuld voordat je kan indienen.');
                return; // Stopt het indienen
            }

            if (invalidEmail) {
                alert(`Fout bij e-mail: ${invalidEmailMessage}`);
                return; // Stopt het indienen vanwege de e-mail
            }

            // Als alles is ingevuld en geldig is → bouw het proposal en sla het op
            const proposal = {
                id: `proposal-${Date.now()}`,
                studentNaam: container.querySelector('#student-naam').value.trim(),
                studentNummer: container.querySelector('#student-nummer').value.trim(),
                bedrijfNaam: container.querySelector('#bedrijf-naam').value.trim(),
                bedrijfAdres: container.querySelector('#bedrijf-adres').value.trim(),
                mentorNaam: container.querySelector('#mentor-naam').value.trim(),
                mentorEmail: container.querySelector('#mentor-email').value.trim(),
                opdrachtOmschrijving: container.querySelector('#opdracht-omschrijving').value.trim(),
                periodeStart: container.querySelector('#periode-start').value,
                periodeEind: container.querySelector('#periode-eind').value,
                status: 'wachten',
                ingediendOp: new Date().toISOString()
            };

            submitBtn.disabled = true;
            try {
                const result = await saveProposal(proposal);
                if (result && result.source === 'local') {
                    alert('Voorstel opgeslagen lokaal (server niet bereikbaar).');
                }
            } catch (err) {
                alert('Er is een fout opgetreden bij het opslaan van je voorstel. Probeer het opnieuw.');
                submitBtn.disabled = false;
                return;
            }

            window.location.assign('/?role=wachten');
        });
    }
}
