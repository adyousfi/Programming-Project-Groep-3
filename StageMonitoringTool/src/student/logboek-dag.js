import './logboek-dag.css';

const DAYS = [
    { name: 'Maandag', short: 'ma' },
    { name: 'Dinsdag', short: 'di' },
    { name: 'Woensdag', short: 'wo' },
    { name: 'Donderdag', short: 'do' },
    { name: 'Vrijdag', short: 'vr' }
];

let testDateOverride = null;
let lastUserName = 'Student';
let lastStageData = null;
let lastWeekNumber = 1;

function getNow() {
    return testDateOverride || new Date();
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear()
        && d1.getMonth() === d2.getMonth()
        && d1.getDate() === d2.getDate();
}

export function renderLogboekDag(container, userName = 'Student', stageData = null, weekNumber = 1) {
    lastUserName = userName || lastUserName;
    lastStageData = stageData || lastStageData;
    lastWeekNumber = weekNumber || lastWeekNumber;
    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;
    const endDate = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde) : null;
    const today = getNow();

    function getDayDateObj(weekIndex, dayIndex) {
        if (!startDate) return null;
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);
        return d;
    }

    function getDayDateStr(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        return d ? d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '?';
    }

    function isDayInStage(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        if (!d || !endDate) return true;
        return d <= endDate;
    }

    function getDayStatus(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        if (!d) return 'future';
        if (sameDay(d, today)) return 'today';
        if (d < today) return 'past';
        return 'future';
    }

    const weekIndex = weekNumber - 1;
    const weekStart = getDayDateStr(weekIndex, 0);

    const weekEndDate = new Date(startDate);
    if (startDate) {
        weekEndDate.setDate(startDate.getDate() + weekIndex * 7 + 4);
        if (endDate && weekEndDate > endDate) {
            weekEndDate.setTime(endDate.getTime());
        }
    }
    const weekEnd = startDate ? weekEndDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '?';

    const visibleDays = DAYS.filter((_, i) => isDayInStage(weekIndex, i));

    function getFormHTML(dayIndex) {
        return `
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
                <div class="logboek-dag-actions">
                    <button class="logboek-dag-save-btn" data-day="${dayIndex}">Dag opslaan</button>
                    <button class="logboek-dag-absent-btn" data-day="${dayIndex}">Afwezig?</button>
                </div>
            </div>
        `;
    }

    function getLockedHTML() {
        return `
            <div class="logboek-dag-card-locked">
                <span class="logboek-dag-locked-text">Vul eerst de vorige dag in om deze dag te ontgrendelen</span>
            </div>
        `;
    }

    function getWaitingHTML() {
        return `
            <div class="logboek-dag-card-locked">
                <span class="logboek-dag-locked-text">Deze dag is nog niet beschikbaar. Je kunt alleen de huidige dag invullen.</span>
            </div>
        `;
    }

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
                        const dayDate = getDayDateStr(weekIndex, dayIndex);
                        const dayStatus = getDayStatus(weekIndex, dayIndex);

                        let badgeClass = 'badge-locked';
                        let badgeText = 'Nog niet beschikbaar';
                        let contentHTML = getLockedHTML();

                        if (dayStatus === 'today') {
                            badgeClass = 'badge-available';
                            badgeText = 'Beschikbaar';
                            contentHTML = getFormHTML(dayIndex);
                        } else if (dayStatus === 'future') {
                            badgeClass = 'badge-locked';
                            badgeText = 'Nog niet beschikbaar';
                            contentHTML = getWaitingHTML();
                        }

                        return `
                            <div class="logboek-dag-card${dayStatus === 'today' ? ' unlocked' : ' locked'}" data-day="${dayIndex}" data-filled="false">
                                <div class="logboek-dag-card-header">
                                    <div class="logboek-dag-card-left">
                                        <span class="logboek-dag-card-name">${day.name}</span>
                                        <span class="logboek-dag-card-date">${dayDate}</span>
                                    </div>
                                    <span class="logboek-dag-card-badge ${badgeClass}">${badgeText}</span>
                                </div>
                                ${contentHTML}
                            </div>
                        `;
                    }).join('')}
                </div>
            </main>
        </div>

        <!-- Test date picker -->
        <div class="test-date-picker">
            <label class="test-date-label">Test datum:</label>
            <input type="date" id="test-date-input" class="test-date-input">
            <button class="test-date-apply" id="test-date-apply">Zet</button>
            <button class="test-date-reset" id="test-date-reset">Reset</button>
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

    function markDayFilled(card, dayIndex, isAbsent) {
        card.dataset.filled = 'true';

        const badge = card.querySelector('.logboek-dag-card-badge');
        badge.classList.remove('badge-available');
        badge.classList.add('badge-filled');
        badge.textContent = isAbsent ? 'Afwezig' : 'Ingevuld';

        const form = card.querySelector('.logboek-dag-card-form');
        if (form) {
            form.querySelectorAll('textarea').forEach(ta => { ta.disabled = true; });
            const saveBtn = form.querySelector('.logboek-dag-save-btn');
            const absentBtn = form.querySelector('.logboek-dag-absent-btn');
            if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Opgeslagen'; }
            if (absentBtn) { absentBtn.disabled = true; absentBtn.textContent = 'Gemarkeerd'; }
        }

        updateFilledCount();
    }

    function attachSaveHandler(card) {
        const saveBtn = card.querySelector('.logboek-dag-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const dayIndex = parseInt(saveBtn.dataset.day);
                markDayFilled(card, dayIndex, false);
            });
        }

        const absentBtn = card.querySelector('.logboek-dag-absent-btn');
        if (absentBtn) {
            absentBtn.addEventListener('click', () => {
                const dayIndex = parseInt(absentBtn.dataset.day);
                markDayFilled(card, dayIndex, true);
            });
        }
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

    // Test date picker
    const testInput = document.getElementById('test-date-input');
    const testApply = document.getElementById('test-date-apply');
    const testReset = document.getElementById('test-date-reset');
    const renderFn = () => {
        const container = document.getElementById('logboek-dag-cards');
        if (container && container.closest('.logboek-dag-layout')) {
            const mainEl = container.closest('.logboek-dag-main');
            const backLink = mainEl?.querySelector('.logboek-dag-back');
            const headerEl = mainEl?.querySelector('.logboek-dag-header');
            const infoEl = mainEl?.querySelector('.logboek-dag-info');
            const url = new URL(window.location.href);
            const week = parseInt(url.searchParams.get('week')) || 1;
            const appEl = document.getElementById('app');
            if (appEl) {
                const role = url.searchParams.get('role');
                import('./logboek-dag.js').then(m => {
                    m.renderLogboekDag(appEl, undefined, undefined, week);
                });
            }
        }
    };

    if (testApply) {
        testApply.addEventListener('click', () => {
            if (testInput.value) {
                testDateOverride = new Date(testInput.value + 'T00:00:00');
                const app = document.getElementById('app');
                import('./logboek-dag.js').then(m => {
                    m.renderLogboekDag(app, lastUserName, lastStageData, lastWeekNumber);
                });
            }
        });
    }

    if (testReset) {
        testReset.addEventListener('click', () => {
            testDateOverride = null;
            testInput.value = '';
            const app = document.getElementById('app');
            import('./logboek-dag.js').then(m => {
                m.renderLogboekDag(app, lastUserName, lastStageData, lastWeekNumber);
            });
        });
    }
}
