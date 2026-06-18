import './aanpassen.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export async function renderAanpassen(container, userName = '[Studentnaam]', stageData = null) {
    const feedback = stageData?.feedback || 'Geen feedback opgegeven door de stagecommissie.';
    const bedrijfNaam = stageData?.bedrijf?.naam || '';
    const bedrijfAdres = stageData?.bedrijf?.adres || '';
    const mentorNaam = stageData?.stagementor?.naam || '';
    const mentorParts = mentorNaam.split(' ');
    const mentorVoornaam = mentorParts[0] || '';
    const mentorAchternaam = mentorParts.slice(1).join(' ') || '';
    const mentorEmail = stageData?.stagementor?.email || '';
    const omschrijving = stageData?.stageDetails?.omschrijving || '';
    const startDatum = stageData?.stageDetails?.start ? stageData.stageDetails.start.split('T')[0] : '';
    const eindDatum = stageData?.stageDetails?.einde ? stageData.stageDetails.einde.split('T')[0] : '';
    const stageId = stageData?.id || '';

    container.innerHTML = `
        <div class="aanpassen-modal-overlay">
            <div class="aanpassen-modal">
                <div class="aanpassen-header">
                    <h2 class="aanpassen-title">Stagevoorstel Aanpassen</h2>
                    <button class="aanpassen-close-btn" id="aanpassen-close">&times;</button>
                </div>

                <div class="aanpassen-feedback">
                    <h3 class="aanpassen-feedback-title">Feedback van de stagecommissie:</h3>
                    <p class="aanpassen-feedback-intro">De stagecommissie heeft aanpassingen gevraagd voor je stagevoorstel. Pas je voorstel aan op basis van onderstaande feedback en dien het opnieuw in.</p>
                    <div class="aanpassen-feedback-content">
                        <p class="aanpassen-feedback-text">${feedback}</p>
                    </div>
                </div>

                <div class="aanpassen-form-body">
                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Bedrijfsgegevens</h3>
                        <div class="aanpassen-form-group">
                            <label for="aanpassen-bedrijf-naam">Bedrijfsnaam</label>
                            <input type="text" id="aanpassen-bedrijf-naam" value="${bedrijfNaam}">
                        </div>
                        <div class="aanpassen-form-group">
                            <label for="aanpassen-bedrijf-adres">Adres</label>
                            <input type="text" id="aanpassen-bedrijf-adres" value="${bedrijfAdres}">
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Stagementor</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="aanpassen-mentor-voornaam">Voornaam</label>
                                <input type="text" id="aanpassen-mentor-voornaam" value="${mentorVoornaam}">
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="aanpassen-mentor-achternaam">Achternaam</label>
                                <input type="text" id="aanpassen-mentor-achternaam" value="${mentorAchternaam}">
                            </div>
                        </div>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="aanpassen-mentor-email">E-mail</label>
                                <input type="email" id="aanpassen-mentor-email" value="${mentorEmail}">
                            </div>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Omschrijving van de opdracht</h3>
                        <div class="aanpassen-form-group">
                            <textarea id="aanpassen-omschrijving" rows="4">${omschrijving}</textarea>
                        </div>
                    </div>

                    <div class="aanpassen-form-section">
                        <h3 class="aanpassen-section-title">Periode</h3>
                        <div class="aanpassen-form-row">
                            <div class="aanpassen-form-group">
                                <label for="aanpassen-start">Startdatum</label>
                                <input type="text" id="aanpassen-start" placeholder="Kies een datum" readonly>
                            </div>
                            <div class="aanpassen-form-group">
                                <label for="aanpassen-eind">Einddatum</label>
                                <input type="text" id="aanpassen-eind" placeholder="Kies een datum" readonly>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="aanpassen-footer">
                    <button class="aanpassen-btn-submit" id="aanpassen-submit">Aangepast Voorstel Indienen</button>
                    <button class="aanpassen-btn-cancel" id="aanpassen-cancel">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#aanpassen-close').addEventListener('click', () => {
        window.location.href = '/dashboard';
    });

    var startInput = container.querySelector('#aanpassen-start');
    var eindInput = container.querySelector('#aanpassen-eind');

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    if (startInput) {
        flatpickr(startInput, {
            disable: [isWeekend],
            dateFormat: 'Y-m-d',
            defaultDate: startDatum || undefined,
            onDayCreate: function(dObj, dStr, fp, dayElem) {
                var dow = dayElem.dateObj.getDay();
                if (dow === 0 || dow === 6) {
                    dayElem.classList.add('weekend-disabled');
                }
            }
        });
    }

    if (eindInput) {
        flatpickr(eindInput, {
            dateFormat: 'Y-m-d',
            defaultDate: eindDatum || undefined,
        });
    }

    container.querySelector('#aanpassen-cancel').addEventListener('click', () => {
        window.location.href = '/dashboard';
    });

    container.querySelector('#aanpassen-submit').addEventListener('click', async () => {
        const btn = container.querySelector('#aanpassen-submit');
        btn.disabled = true;
        btn.textContent = 'Bezig met indienen...';

        const updatedData = {
            bedrijfNaam: container.querySelector('#aanpassen-bedrijf-naam').value.trim(),
            bedrijfAdres: container.querySelector('#aanpassen-bedrijf-adres').value.trim(),
            mentorVoornaam: container.querySelector('#aanpassen-mentor-voornaam').value.trim(),
            mentorAchternaam: container.querySelector('#aanpassen-mentor-achternaam').value.trim(),
            mentorEmail: container.querySelector('#aanpassen-mentor-email').value.trim(),
            opdrachtOmschrijving: container.querySelector('#aanpassen-omschrijving').value.trim(),
            periodeStart: container.querySelector('#aanpassen-start').value,
            periodeEind: container.querySelector('#aanpassen-eind').value,
        };

        if (!updatedData.bedrijfNaam || !updatedData.mentorVoornaam || !updatedData.mentorAchternaam || !updatedData.mentorEmail || !updatedData.opdrachtOmschrijving) {
            alert('Vul alle verplichte velden in.');
            btn.disabled = false;
            btn.textContent = 'Aangepast Voorstel Indienen';
            return;
        }

        try {
            const response = await fetch(`/api/stages/${stageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'AANVRAAG',
                    feedback: null,
                    bedrijfNaam: updatedData.bedrijfNaam,
                    bedrijfAdres: updatedData.bedrijfAdres,
                    mentorNaam: updatedData.mentorNaam,
                    mentorEmail: updatedData.mentorEmail,
                    omschrijving_opdracht: updatedData.opdrachtOmschrijving,
                    begin_datum: updatedData.periodeStart,
                    eind_datum: updatedData.periodeEind,
                }),
            });

            if (!response.ok) throw new Error('Server fout');

            window.location.href = '/dashboard';
        } catch (err) {
            alert('Er is iets misgegaan bij het indienen: ' + err.message);
            btn.disabled = false;
            btn.textContent = 'Aangepast Voorstel Indienen';
        }
    });
}
