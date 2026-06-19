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

function toDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function renderLogboekDag(container, userName = 'Student', stageData = null, weekNumber = 1) {
    lastUserName = userName || lastUserName;
    lastStageData = stageData || lastStageData;
    lastWeekNumber = weekNumber || lastWeekNumber;
    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;
    if (startDate) startDate.setHours(12, 0, 0, 0);
    const endDate = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde) : null;
    if (endDate) endDate.setHours(12, 0, 0, 0);
    const today = getNow();

    let logboekEntries = [];
    let evalAvailable = false;
    if (stageData?.id) {
        try {
            const res = await fetch(`/api/logboek/stage/${stageData.id}`, { credentials: 'include' });
            logboekEntries = await res.json();
        } catch (err) {
            console.error('Error fetching logboek:', err);
        }
        try {
            const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${stageData.id}`, { credentials: 'include' });
            const evalData = await evalRes.json();
            evalAvailable = evalData.bestaatDoorDocent === true;
        } catch {}
    }

    function getDayDateObj(weekIndex, dayIndex) {
        if (!startDate) return null;
        const d = new Date(startDate);

        if (weekIndex === 0) {
            while (d.getDay() === 0 || d.getDay() === 6) {
                d.setDate(d.getDate() + 1);
            }
            const startDay = d.getDay();
            const daysInWeek0 = 6 - startDay;
            if (dayIndex >= daysInWeek0) return null;
        } else {
            const startDay = startDate.getDay();
            const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
            d.setDate(startDate.getDate() + daysToMonday + (weekIndex - 1) * 7);
        }

        let count = 0;
        while (count < dayIndex) {
            d.setDate(d.getDate() + 1);
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                count++;
            }
        }
        return d;
    }

    function getDayDateStr(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        return d ? d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '?';
    }

    function isDayInStage(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        if (!d) return false;
        if (!endDate) return true;
        return d <= endDate;
    }

    function getDayStatus(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        if (!d) return 'future';
        if (sameDay(d, today)) return 'today';
        if (d < today) return 'past';
        return 'future';
    }

    function getEntryForDay(weekIndex, dayIndex) {
        const d = getDayDateObj(weekIndex, dayIndex);
        if (!d) return null;
        const dateStr = toDateStr(d);
        return logboekEntries.find(e => {
            if (!e.datum) return false;
            const entryDate = new Date(e.datum);
            entryDate.setHours(12, 0, 0, 0);
            return toDateStr(entryDate) === dateStr;
        }) || null;
    }

    const weekIndex = weekNumber - 1;
    const weekStart = getDayDateStr(weekIndex, 0);

    const totalWeeks = startDate && endDate
        ? (() => {
            let count = 1;
            const s = new Date(startDate);
            s.setHours(12, 0, 0, 0);
            const startDay = s.getDay();
            const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
            s.setDate(s.getDate() + daysToMonday);
            while (s <= endDate) {
                count++;
                s.setDate(s.getDate() + 7);
            }
            return count;
        })()
        : 16;

    const visibleDays = DAYS.filter((_, i) => isDayInStage(weekIndex, i));
    const lastDayIndex = visibleDays.length - 1;

    const weekEndDate = getDayDateObj(weekIndex, lastDayIndex);
    if (endDate && weekEndDate && weekEndDate > endDate) {
        weekEndDate.setTime(endDate.getTime());
    }
    const weekEnd = weekEndDate ? weekEndDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' }) : '?';

    function getFormHTML(dayIndex, entry) {
        const taken = entry ? entry.uitgevoerdeTaken || '' : '';
        const reflectie = entry ? entry.reflectie || '' : '';
        const leerpunten = entry ? entry.leerpunten || '' : '';
        return `
            <div class="logboek-dag-card-form">
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Beschrijving van uitgevoerde taken <span class="logboek-dag-required">*</span></label>
                    <textarea class="logboek-dag-textarea" placeholder="Wat heb je vandaag gedaan?" rows="4" required>${taken}</textarea>
                </div>
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Reflectie <span class="logboek-dag-required">*</span></label>
                    <textarea class="logboek-dag-textarea" placeholder="Wat heb je geleerd?" rows="4" required>${reflectie}</textarea>
                </div>
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Problemen of leerpunten <span class="logboek-dag-required">*</span></label>
                    <textarea class="logboek-dag-textarea" placeholder="Welke uitdagingen kwam je tegen?" rows="4" required>${leerpunten}</textarea>
                </div>
                <div class="logboek-dag-card-bottom">
                    <button class="logboek-dag-save-btn" data-day="${dayIndex}" type="button">Dag opslaan</button>
                    <button class="logboek-dag-absent-btn" data-day="${dayIndex}" type="button">Afwezig?</button>
                </div>
            </div>
        `;
    }

    function getFilledHTML(entry, isAbsent) {
        const taken = entry ? entry.uitgevoerdeTaken || '' : '';
        const reflectie = entry ? entry.reflectie || '' : '';
        const leerpunten = entry ? entry.leerpunten || '' : '';
        return `
            <div class="logboek-dag-card-form">
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Beschrijving van uitgevoerde taken</label>
                    <textarea class="logboek-dag-textarea" rows="4" disabled>${taken}</textarea>
                </div>
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Reflectie</label>
                    <textarea class="logboek-dag-textarea" rows="4" disabled>${reflectie}</textarea>
                </div>
                <div class="logboek-dag-field">
                    <label class="logboek-dag-label">Problemen of leerpunten</label>
                    <textarea class="logboek-dag-textarea" rows="4" disabled>${leerpunten}</textarea>
                </div>
                <div class="logboek-dag-card-bottom">
                    <button class="logboek-dag-save-btn" disabled>Opgeslagen</button>
                    <button class="logboek-dag-absent-btn" disabled>${isAbsent ? 'Afwezig' : 'Afwezig?'}</button>
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
                        <a href="${evalAvailable ? '?role=evaluatie' : '#'}" class="sidebar-nav-item${evalAvailable ? '' : ' disabled'}">Evaluatie</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <main class="logboek-dag-main">
                <a href="?role=logboek" class="logboek-dag-back">&larr; Terug naar weekoverzicht</a>

                <div class="logboek-dag-nav">
                    <button class="logboek-dag-nav-btn" id="logboek-dag-prev" ${weekNumber <= 1 ? 'disabled' : ''}>&#8592; Vorige week</button>
                    <span class="logboek-dag-nav-info">Week ${weekNumber} / ${totalWeeks}</span>
                    <button class="logboek-dag-nav-btn" id="logboek-dag-next" ${weekNumber >= totalWeeks ? 'disabled' : ''}>&#8594; Volgende week</button>
                </div>

                <div class="logboek-dag-header">
                    <div>
                        <h1 class="logboek-dag-title">Week ${weekNumber}</h1>
                        <p class="logboek-dag-dates">${weekStart} t/m ${weekEnd}</p>
                    </div>
                    <div class="logboek-dag-header-actions">
                        <button class="logboek-dag-submit-btn" id="week-indienen" disabled>Week Indienen</button>
                    </div>
                </div>

                <p class="logboek-dag-info">Vul elke dag van de week in. Je dient het volledige logboek in &eacute;&eacute;n keer per week in bij je mentor. (<span id="filled-count">0</span>/${visibleDays.length} dagen ingevuld)</p>

                <div class="logboek-dag-cards" id="logboek-dag-cards">
                    ${visibleDays.map((day, i) => {
                        const dayIndex = i;
                        const dayDate = getDayDateStr(weekIndex, dayIndex);
                        const dayDateObj = getDayDateObj(weekIndex, dayIndex);
                        const dayName = dayDateObj
                            ? dayDateObj.toLocaleDateString('nl-BE', { weekday: 'long' }).replace(/^./, c => c.toUpperCase())
                            : day.name;
                        const dayStatus = getDayStatus(weekIndex, dayIndex);
                        const entry = getEntryForDay(weekIndex, dayIndex);
                        const isSaved = entry && (entry.status === 'DEELSINGEVULD' || entry.status === 'INGEVULD');
                        const isAbsent = entry && entry.uitgevoerdeTaken === 'AFWEZIG';
                        const isGevinkt = entry && entry.gevinkt_door_stagementor;

                        let badgeClass = 'badge-locked';
                        let badgeText = 'Nog niet beschikbaar';
                        let contentHTML = getLockedHTML();
                        let cardClass = 'locked';
                        let dataFilled = 'false';

                        if (isGevinkt) {
                            badgeClass = 'badge-gevinkt';
                            badgeText = 'Afgevinkt door stagementor';
                            contentHTML = getFilledHTML(entry, isAbsent);
                            cardClass = 'unlocked';
                            dataFilled = 'true';
                        } else if (isSaved) {
                            badgeClass = 'badge-filled';
                            badgeText = 'Ingevuld';
                            contentHTML = getFilledHTML(entry, isAbsent);
                            cardClass = 'unlocked';
                            dataFilled = 'true';
                        } else if (dayStatus === 'today') {
                            badgeClass = 'badge-available';
                            badgeText = 'Beschikbaar';
                            contentHTML = getFormHTML(dayIndex, entry);
                            cardClass = 'unlocked';
                        } else if (dayStatus === 'future') {
                            badgeClass = 'badge-locked';
                            badgeText = 'Nog niet beschikbaar';
                            contentHTML = getWaitingHTML();
                        }

                        return `
                            <div class="logboek-dag-card ${cardClass}" data-day="${dayIndex}" data-filled="${dataFilled}">
                                <div class="logboek-dag-card-header">
                                    <div class="logboek-dag-card-left">
                                        <span class="logboek-dag-card-name">${dayName}</span>
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

        <!-- Afwezig modal -->
        <div class="logboek-dag-modal-overlay" id="absent-modal" style="display:none;">
            <div class="logboek-dag-modal">
                <div class="logboek-dag-modal-icon">&#9888;</div>
                <h3 class="logboek-dag-modal-title">Afwezig markeren?</h3>
                <p class="logboek-dag-modal-text">Weet je zeker dat je deze dag als afwezig wilt markeren? Je hoeft dan geen logboek in te vullen voor deze dag.</p>
                <div class="logboek-dag-modal-actions">
                    <button class="logboek-dag-modal-btn logboek-dag-modal-cancel" id="absent-cancel">Annuleren</button>
                    <button class="logboek-dag-modal-btn logboek-dag-modal-confirm" id="absent-confirm">Bevestig afwezig</button>
                </div>
            </div>
        </div>

        <!-- Test date picker -->
        <div class="test-date-picker">
            <label class="test-date-label">Test datum:</label>
            <input type="date" id="test-date-input" class="test-date-input">
            <button class="test-date-apply" id="test-date-apply">Zet</button>
            <button class="test-date-reset" id="test-date-reset">Reset</button>
        </div>
    `;

    initLogboekDagHandlers(visibleDays.length, stageData, weekIndex, getDayDateObj, logboekEntries);
}

function initLogboekDagHandlers(totalDays, stageData, weekIndex, getDayDateObj, logboekEntries) {
    const cards = document.querySelectorAll('.logboek-dag-card');
    const submitBtn = document.getElementById('week-indienen');
    const filledCountEl = document.getElementById('filled-count');
    const stageId = stageData?.id;

    const weekAllIngevuld = Array.from({ length: totalDays }, (_, i) => {
        const d = getDayDateObj(weekIndex, i);
        if (!d) return false;
        const dateStr = toDateStr(d);
        return logboekEntries.some(e => {
            if (!e.datum) return false;
            const ed = new Date(e.datum);
            ed.setHours(12, 0, 0, 0);
            return toDateStr(ed) === dateStr && e.status === 'INGEVULD';
        });
    }).every(Boolean);

    if (weekAllIngevuld) {
        if (submitBtn) { submitBtn.style.display = 'none'; }
    }

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
            if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Opgeslagen'; }
        }

        const absentBtn = card.querySelector('.logboek-dag-absent-btn');
        if (absentBtn) { absentBtn.disabled = true; absentBtn.textContent = 'Afwezig'; }

        updateFilledCount();
    }

    function attachSaveHandler(card) {
        const saveBtn = card.querySelector('.logboek-dag-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const form = card.querySelector('.logboek-dag-card-form');
                if (!form) return;
                const textareas = form.querySelectorAll('textarea');
                let allFilled = true;
                textareas.forEach(ta => {
                    if (!ta.value.trim()) {
                        allFilled = false;
                        ta.style.borderColor = '#dc3545';
                        ta.addEventListener('input', () => { ta.style.borderColor = ''; }, { once: true });
                    }
                });
                if (!allFilled) return;

                const dayIndex = parseInt(saveBtn.dataset.day);
                const entryDate = getDayDateObj(weekIndex, dayIndex);
                if (!entryDate || !stageId) return;
                const datum = toDateStr(entryDate);

                const textValues = [];
                textareas.forEach(ta => textValues.push(ta.value.trim()));

                saveBtn.disabled = true;
                saveBtn.textContent = 'Opslaan...';

                try {
                    const res = await fetch('/api/logboek', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            stage_id: stageId,
                            datum,
                            uitgevoerdeTaken: textValues[0],
                            reflectie: textValues[1],
                            leerpunten: textValues[2],
                            status: 'DEELSINGEVULD'
                        })
                    });
                    if (res.ok) {
                        markDayFilled(card, dayIndex, false);
                    } else {
                        saveBtn.disabled = false;
                        saveBtn.textContent = 'Dag opslaan';
                        alert('Fout bij opslaan. Probeer opnieuw.');
                    }
                } catch (err) {
                    console.error('Error saving logboek entry:', err);
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Dag opslaan';
                    alert('Server fout bij opslaan.');
                }
            });
        }

        const absentBtn = card.querySelector('.logboek-dag-absent-btn');
        if (absentBtn) {
            absentBtn.addEventListener('click', () => {
                const dayIndex = parseInt(absentBtn.dataset.day);
                const modal = document.getElementById('absent-modal');
                const cancelBtn = document.getElementById('absent-cancel');
                const confirmBtn = document.getElementById('absent-confirm');

                modal.style.display = 'flex';

                function closeModal() {
                    modal.style.display = 'none';
                    cancelBtn.removeEventListener('click', closeModal);
                    confirmBtn.removeEventListener('click', confirmAbsence);
                    modal.removeEventListener('click', onOverlayClick);
                }

                function onOverlayClick(e) {
                    if (e.target === modal) closeModal();
                }

                async function confirmAbsence() {
                    closeModal();

                    const entryDate = getDayDateObj(weekIndex, dayIndex);
                    if (!entryDate || !stageId) return;
                    const datum = toDateStr(entryDate);

                    try {
                        await fetch('/api/logboek', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                stage_id: stageId,
                                datum,
                                uitgevoerdeTaken: 'AFWEZIG',
                                reflectie: '',
                                leerpunten: '',
                                status: 'DEELSINGEVULD'
                            })
                        });
                    } catch (err) {
                        console.error('Error saving absence:', err);
                    }

                    markDayFilled(card, dayIndex, true);
                }

                cancelBtn.addEventListener('click', closeModal);
                confirmBtn.addEventListener('click', confirmAbsence);
                modal.addEventListener('click', onOverlayClick);
            });
        }
    }

    cards.forEach(card => {
        if (!card.classList.contains('locked')) {
            attachSaveHandler(card);
        }
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            if (!stageId) return;

            const firstDayDate = getDayDateObj(weekIndex, 0);
            const lastDayDate = getDayDateObj(weekIndex, totalDays - 1);
            if (!firstDayDate || !lastDayDate) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Indienen...';

            try {
                const res = await fetch('/api/logboek/submit-week', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        stage_id: stageId,
                        weekStart: toDateStr(firstDayDate),
                        weekEnd: toDateStr(lastDayDate)
                    })
                });
                if (res.ok) {
                    alert('Week succesvol ingediend!');
                    window.location.href = '/logboek';
                } else {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Week Indienen';
                    alert('Fout bij indienen. Probeer opnieuw.');
                }
            } catch (err) {
                console.error('Error submitting week:', err);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Week Indienen';
                alert('Server fout bij indienen.');
            }
        });
    }

    // Test date picker
    const testInput = document.getElementById('test-date-input');
    const testApply = document.getElementById('test-date-apply');
    const testReset = document.getElementById('test-date-reset');

    // Week navigation
    const prevBtn = document.getElementById('logboek-dag-prev');
    const nextBtn = document.getElementById('logboek-dag-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (lastWeekNumber > 1) {
                const app = document.getElementById('app');
                import('./logboek-dag.js').then(m => {
                    m.renderLogboekDag(app, lastUserName, lastStageData, lastWeekNumber - 1);
                });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxWeeks = lastStageData?.stageDetails?.start && lastStageData?.stageDetails?.einde
                ? (() => {
                    const s = new Date(lastStageData.stageDetails.start);
                    const e = new Date(lastStageData.stageDetails.einde);
                    let count = 1;
                    const startDay = s.getDay();
                    const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
                    s.setDate(s.getDate() + daysToMonday);
                    while (s <= e) {
                        count++;
                        s.setDate(s.getDate() + 7);
                    }
                    return count;
                })()
                : 16;
            if (lastWeekNumber < maxWeeks) {
                const app = document.getElementById('app');
                import('./logboek-dag.js').then(m => {
                    m.renderLogboekDag(app, lastUserName, lastStageData, lastWeekNumber + 1);
                });
            }
        });
    }

    if (testApply) {
        testApply.addEventListener('click', () => {
            if (testInput.value) {
                const override = new Date(testInput.value);
                override.setHours(12, 0, 0, 0);
                testDateOverride = override;
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

    updateFilledCount();
}
