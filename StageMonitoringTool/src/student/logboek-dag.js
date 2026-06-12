import './logboek-dag.css';

const DAYS = [
    { name: 'Maandag', short: 'ma' },
    { name: 'Dinsdag', short: 'di' },
    { name: 'Woensdag', short: 'wo' },
    { name: 'Donderdag', short: 'do' },
    { name: 'Vrijdag', short: 'vr' }
];

export function renderLogboekDag(container, userName = 'Student', stageData = null, weekNumber = 1) {
    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;
    const endDate = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde) : null;

    function getDayDate(weekIndex, dayIndex) {
        if (!startDate) return '?';
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
        return d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
    }

    function isDayInStage(weekIndex, dayIndex) {
        if (!startDate || !endDate) return true;
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
        return d <= endDate;
    }

    const weekIndex = weekNumber - 1;
    const weekStart = getDayDate(weekIndex, 0);

    const weekEndDate = new Date(startDate);
    if (startDate) {
        weekEndDate.setDate(startDate.getDate() + weekIndex * 7 + 4);
        if (endDate && weekEndDate > endDate) {
            weekEndDate.setTime(endDate.getTime());
        }
    }
    const weekEnd = startDate ? weekEndDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '?';

    const visibleDays = DAYS.filter((_, i) => isDayInStage(weekIndex, i));

    let filledDays = 0;

    container.innerHTML = `
        <div class="logboek-dag-layout">
            <aside class="logboek-dag-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="?role=goedgekeurd_student" class="sidebar-nav-item">Overzicht</a>
                        <a href="?role=stagedetails" class="sidebar-nav-item">Stagedetails</a>
                        <a href="?role=documenten" class="sidebar-nav-item">Documenten</a>
                        <a href="?role=logboek" class="sidebar-nav-item active">Logboek</a>
                        <a href="#" class="sidebar-nav-item disabled">Evaluatie</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <main class="logboek-dag-main">
                <a href="?role=logboek" class="logboek-dag-back">&larr; Terug naar weekoverzicht</a>

                <div class="logboek-dag-header">
                    <div>
                        <h1 class="logboek-dag-title">Week ${weekNumber}</h1>
                        <p class="logboek-dag-dates">${weekStart} t/m ${weekEnd}</p>
                    </div>
                    <button class="logboek-dag-submit-btn" id="week-indienen" disabled>Week Indienen</button>
                </div>

                <p class="logboek-dag-info">Vul elke dag van de week in. Je dient het volledige logboek in &eacute;&eacute;n keer per week in bij je mentor. (<span id="filled-count">0</span>/${visibleDays.length} dagen ingevuld)</p>

                <div class="logboek-dag-cards" id="logboek-dag-cards">
                    ${visibleDays.map((day, i) => {
                        const dayIndex = i;
                        const dayDate = getDayDate(weekIndex, dayIndex);
                        const isFirst = i === 0;
                        return `
                            <div class="logboek-dag-card${isFirst ? ' unlocked' : ' locked'}" data-day="${dayIndex}" data-filled="false">
                                <div class="logboek-dag-card-header">
                                    <div class="logboek-dag-card-left">
                                        <span class="logboek-dag-card-name">${day.name}</span>
                                        <span class="logboek-dag-card-date">${dayDate}</span>
                                    </div>
                                    <span class="logboek-dag-card-badge${isFirst ? ' badge-available' : ' badge-locked'}">${isFirst ? 'Beschikbaar' : 'Nog niet beschikbaar'}</span>
                                </div>
                                ${isFirst ? `
                                    <div class="logboek-dag-card-form">
                                        <div class="logboek-dag-field">
                                            <label class="logboek-dag-label">Beschrijving van uitgevoerde taken</label>
                                            <textarea class="logboek-dag-textarea" placeholder="Wat heb je vandaag gedaan?" rows="4"></textarea>
                                        </div>
                                        <div class="logboek-dag-field">
                                            <label class="logboek-dag-label">Reflectie</label>
                                            <textarea class="logboek-dag-textarea" placeholder="Wat heb je geleerd?" rows="4"></textarea>
                                        </div>
                                        <div class="logboek-dag-field">
                                            <label class="logboek-dag-label">Problemen of leerpunten</label>
                                            <textarea class="logboek-dag-textarea" placeholder="Welke uitdagingen kwam je tegen?" rows="4"></textarea>
                                        </div>
                                        <button class="logboek-dag-save-btn" data-day="${dayIndex}">Dag opslaan</button>
                                    </div>
                                ` : `
                                    <div class="logboek-dag-card-locked">
                                        <span class="logboek-dag-locked-text">Vul eerst de vorige dag in om deze dag te ontgrendelen</span>
                                    </div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </main>
        </div>
    `;

    initLogboekDagHandlers(visibleDays.length);
}

function initLogboekDagHandlers(totalDays) {
    const cards = document.querySelectorAll('.logboek-dag-card');
    const submitBtn = document.getElementById('week-indienen');
    const filledCountEl = document.getElementById('filled-count');

    function updateFilledCount() {
        let count = 0;
        cards.forEach(c => { if (c.dataset.filled === 'true') count++; });
        if (filledCountEl) filledCountEl.textContent = count;
        if (submitBtn) submitBtn.disabled = count < totalDays;
    }

    function unlockNextDay(currentIndex) {
        const nextCard = document.querySelector(`.logboek-dag-card[data-day="${currentIndex + 1}"]`);
        if (!nextCard) return;

        nextCard.classList.remove('locked');
        nextCard.classList.add('unlocked');
        nextCard.dataset.filled = 'false';

        const badge = nextCard.querySelector('.logboek-dag-card-badge');
        badge.classList.remove('badge-locked');
        badge.classList.add('badge-available');
        badge.textContent = 'Beschikbaar';

        const lockedDiv = nextCard.querySelector('.logboek-dag-card-locked');
        if (lockedDiv) {
            lockedDiv.outerHTML = `
                <div class="logboek-dag-card-form">
                    <div class="logboek-dag-field">
                        <label class="logboek-dag-label">Beschrijving van uitgevoerde taken</label>
                        <textarea class="logboek-dag-textarea" placeholder="Wat heb je vandaag gedaan?" rows="4"></textarea>
                    </div>
                    <div class="logboek-dag-field">
                        <label class="logboek-dag-label">Reflectie</label>
                        <textarea class="logboek-dag-textarea" placeholder="Wat heb je geleerd?" rows="4"></textarea>
                    </div>
                    <div class="logboek-dag-field">
                        <label class="logboek-dag-label">Problemen of leerpunten</label>
                        <textarea class="logboek-dag-textarea" placeholder="Welke uitdagingen kwam je tegen?" rows="4"></textarea>
                    </div>
                    <button class="logboek-dag-save-btn" data-day="${currentIndex + 1}">Dag opslaan</button>
                </div>
            `;
            attachSaveHandler(nextCard);
        }
    }

    function attachSaveHandler(card) {
        const saveBtn = card.querySelector('.logboek-dag-save-btn');
        if (!saveBtn) return;
        saveBtn.addEventListener('click', () => {
            const dayIndex = parseInt(saveBtn.dataset.day);
            card.dataset.filled = 'true';

            const badge = card.querySelector('.logboek-dag-card-badge');
            badge.classList.remove('badge-available');
            badge.classList.add('badge-filled');
            badge.textContent = 'Ingevuld';

            const form = card.querySelector('.logboek-dag-card-form');
            if (form) {
                form.querySelectorAll('textarea').forEach(ta => { ta.disabled = true; });
                saveBtn.disabled = true;
                saveBtn.textContent = 'Opgeslagen';
            }

            updateFilledCount();
            unlockNextDay(dayIndex);
        });
    }

    cards.forEach(card => {
        if (!card.classList.contains('locked')) {
            attachSaveHandler(card);
        }
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            alert('Week succesvol ingediend!');
        });
    }
}
