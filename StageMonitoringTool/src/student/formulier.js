import './formulier.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export async function renderStageformulier(container) {
    let displayName = '';
    try {
        const res = await fetch('/me', { credentials: 'include' });
        const data = await res.json();
        if (data.loggedIn && data.user) {
            if (data.user.last_name && data.user.first_name) {
                displayName = `${data.user.last_name.toUpperCase()} ${data.user.first_name}`;
            } else {
                displayName = data.user.first_name || '';
            }
        }
    } catch {}

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
                            <div class="form-group" style="width: 100%;">
                                <label for="student-naam">Naam *</label>
                                <input type="text" id="student-naam" value="${displayName}" readonly>
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
                        <div class="form-group">
                            <label for="bedrijf-hr-email">HR E-mail bedrijf * <span style="font-size:12px;color:#6b7280;font-weight:400;"></span></label>
                            <input type="email" id="bedrijf-hr-email" value="" placeholder="hr@bedrijf.be">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="section-title">Stagementor / Werkbegeleider</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="mentor-voornaam">Voornaam *</label>
                                <input type="text" id="mentor-voornaam" value="">
                            </div>
                            <div class="form-group">
                                <label for="mentor-achternaam">Achternaam *</label>
                                <input type="text" id="mentor-achternaam" value="">
                            </div>
                        </div>
                        <div class="form-row">
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
                                <input type="text" id="periode-start" placeholder="Kies een datum" readonly>
                            </div>
                            <div class="form-group">
                                <label for="periode-eind">Einddatum *</label>
                                <input type="text" id="periode-eind" placeholder="Kies een datum" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-footer">
                    <button type="button" class="btn-fill-random">Vul willekeurig in</button>
                    <button type="button" class="btn-primary">Indienen</button>
                    <button type="button" class="btn-secondary">Annuleren</button>
                </div>
            </div>
        </div>
    `;

    const goBack = () => {
        window.location.href = '/dashboard';
    };

    const closeBtn = container.querySelector('.form-close-btn');
    const cancelBtn = container.querySelector('.btn-secondary');
    const submitBtn = container.querySelector('.btn-primary');
    const randomBtn = container.querySelector('.btn-fill-random');

    if (closeBtn) closeBtn.addEventListener('click', goBack);
    if (cancelBtn) cancelBtn.addEventListener('click', goBack);

    var startInput = container.querySelector('#periode-start');
    var eindInput = container.querySelector('#periode-eind');

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    if (startInput) {
        flatpickr(startInput, {
            disable: [isWeekend],
            dateFormat: 'Y-m-d',
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
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

            const voornamen = ['Jan', 'Pieter', 'Thomas', 'Lars', 'Mathias', 'Senne', 'Florian', 'Wout', 'Arno', 'Jelle'];
            const achternamen = ['De Smedt', 'Peeters', 'Janssens', 'Mertens', 'Claes', 'Wouters', 'Goossens', 'Bogaert', 'Dubois', 'Simon'];
            const bedrijven = ['CloudTech NV', 'WebStudio BVBA', 'Digital Solutions', 'Innovation Labs', 'DataSoft Solutions', 'Mobile Apps Inc', 'TechCorp Belgium', 'SmartSystems'];
            const straten = ['Brusselsestraat', 'Kerkstraat', 'Steenstraat', 'Keizerlaan', 'Antwerpsesteenweg', 'Technologielaan', 'Gasthuisstraat'];
            const steden = ['1000 Brussel', '2000 Antwerpen', '3000 Leuven', '9000 Gent', '8000 Brugge'];
            const functies = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Analyst', 'UX Designer'];
            const omschrijvingen = [
                'Bouwen van moderne web interfaces met React en Node.js.',
                'Ontwikkeling van een cross-platform mobiele applicatie.',
                'Optimaliseren van cloud infrastructuren en CI/CD pipelines.',
                'Data-analyse en het bouwen van dashboards voor interne rapportering.',
                'Ontwerpen en implementeren van RESTful API\'s.',
                'Werken aan een SaaS-platform voor het beheren van klantrelaties.'
            ];

            const startDag = randNum(1, 28);
            const startMaand = randNum(9, 12);
            const startJaar = 2026;
            const eindDag = randNum(1, 28);
            const eindMaand = randNum(1, 6);
            const eindJaar = 2027;

            const voornaam = pick(voornamen);
            const achternaam = pick(achternamen);
            const mentorVoornaam = pick(voornamen);
            const mentorAchternaam = pick(achternamen);

            container.querySelector('#bedrijf-naam').value = pick(bedrijven);
            container.querySelector('#bedrijf-adres').value = `${pick(straten)} ${randNum(1, 200)}, ${pick(steden)}`;
            container.querySelector('#bedrijf-hr-email').value = `hr@${pick(['techsolutions.be', 'webstudio.be', 'innovation.be', 'cloudtech.be'])}`;
            container.querySelector('#mentor-voornaam').value = mentorVoornaam;
            container.querySelector('#mentor-achternaam').value = mentorAchternaam;
            container.querySelector('#mentor-email').value = `${mentorVoornaam.toLowerCase()}.${mentorAchternaam.toLowerCase()}@${pick(['techsolutions.be', 'webstudio.be', 'innovation.be', 'cloudtech.be'])}`;
            container.querySelector('#opdracht-omschrijving').value = pick(omschrijvingen);

            const startPickr = container.querySelector('#periode-start')._flatpickr;
            const eindPickr = container.querySelector('#periode-eind')._flatpickr;
            startPickr.setDate(`${startJaar}-${String(startMaand).padStart(2, '0')}-${String(startDag).padStart(2, '0')}`);
            eindPickr.setDate(`${eindJaar}-${String(eindMaand).padStart(2, '0')}-${String(eindDag).padStart(2, '0')}`);

            // Reset border colors
            container.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '#ced4da');
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const inputs = container.querySelectorAll('input, textarea');
            let hasEmptyFields = false;
            let invalidEmail = false;
            let invalidEmailMessage = '';

            const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];

            inputs.forEach(input => {
                const val = input.value.trim();

                if (val === '') {
                    hasEmptyFields = true;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '#ced4da';

                    if (input.id === 'mentor-email' || input.id === 'bedrijf-hr-email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(val)) {
                            invalidEmail = true;
                            invalidEmailMessage = 'Ongeldig e-mailformaat.';
                            input.style.borderColor = '#dc3545';
                        } else {
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

            if (hasEmptyFields) {
                alert('Ho even! Je bent gestopt. Zorg ervoor dat alle verplichte velden zijn ingevuld voordat je kan indienen.');
                return;
            }

            if (invalidEmail) {
                alert(`Fout bij e-mail: ${invalidEmailMessage}`);
                return;
            }

            const proposal = {
                studentNaam: container.querySelector('#student-naam').value.trim(),
                bedrijfNaam: container.querySelector('#bedrijf-naam').value.trim(),
                bedrijfAdres: container.querySelector('#bedrijf-adres').value.trim(),
                bedrijfHrEmail: container.querySelector('#bedrijf-hr-email').value.trim(),
                mentorVoornaam: container.querySelector('#mentor-voornaam').value.trim(),
                mentorAchternaam: container.querySelector('#mentor-achternaam').value.trim(),
                mentorEmail: container.querySelector('#mentor-email').value.trim(),
                opdrachtOmschrijving: container.querySelector('#opdracht-omschrijving').value.trim(),
                periodeStart: container.querySelector('#periode-start').value,
                periodeEind: container.querySelector('#periode-eind').value,
            };

            submitBtn.disabled = true;
            try {
                const res = await fetch('/api/stages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(proposal),
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    alert('Fout bij indienen: ' + (err.msg || 'Onbekende fout'));
                    submitBtn.disabled = false;
                    return;
                }
            } catch (e) {
                alert('Netwerkfout bij indienen. Probeer opnieuw.');
                submitBtn.disabled = false;
                return;
            }
            window.location.href = '/wachten';
        });
    }
}
