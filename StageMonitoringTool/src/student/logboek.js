import './logboek.css';

export async function renderLogboek(container, userName = 'Student', stageData = null) {
    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;
    const endDate = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde) : null;

    let logboekEntries = [];
    if (stageData?.id) {
        try {
            const res = await fetch(`/api/logboek/stage/${stageData.id}`, { credentials: 'include' });
            logboekEntries = await res.json();
        } catch (err) {
            console.error('Error fetching logboek:', err);
        }
    }

    function formatDate(d) {
        return d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' });
    }

    function toDateStr(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getWeekDates(weekIndex) {
        if (!startDate) return { start: '?', end: '?', days: 5, startDateObj: null, endDateObj: null };
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + weekIndex * 7);
        while (weekStart.getDay() === 0 || weekStart.getDay() === 6) {
            weekStart.setDate(weekStart.getDate() + 1);
        }
        const weekEnd = new Date(weekStart);
        let weekdayCount = 1;
        while (weekdayCount < 5) {
            weekEnd.setDate(weekEnd.getDate() + 1);
            if (weekEnd.getDay() !== 0 && weekEnd.getDay() !== 6) {
                weekdayCount++;
            }
        }

        if (endDate && weekEnd > endDate) {
            weekEnd.setTime(endDate.getTime());
            let count = 0;
            const temp = new Date(weekStart);
            while (temp <= weekEnd) {
                if (temp.getDay() !== 0 && temp.getDay() !== 6) count++;
                temp.setDate(temp.getDate() + 1);
            }
            weekdayCount = Math.max(1, count);
        }

        return {
            start: formatDate(weekStart),
            end: formatDate(weekEnd),
            days: weekdayCount,
            startDateObj: new Date(weekStart),
            endDateObj: new Date(weekEnd)
        };
    }

    const totalWeeks = startDate && endDate
        ? Math.ceil(((endDate - startDate) / (1000 * 60 * 60 * 24) + 1) / 7)
        : 16;

    const weeks = Array.from({ length: Math.max(1, totalWeeks) }, (_, i) => {
        const dates = getWeekDates(i);

        let daysFilled = 0;
        let allIngevuld = false;
        let hasEntries = false;

        if (dates.startDateObj) {
            const weekEntries = logboekEntries.filter(e => {
                if (!e.datum) return false;
                const entryDate = new Date(e.datum);
                return entryDate >= dates.startDateObj && entryDate <= dates.endDateObj;
            });

            hasEntries = weekEntries.length > 0;
            const filledEntries = weekEntries.filter(e => e.status === 'DEELSINGEVULD' || e.status === 'INGEVULD');
            daysFilled = filledEntries.length;
            allIngevuld = weekEntries.length > 0 && weekEntries.every(e => e.status === 'INGEVULD');
        }

        let status = 'not_submitted';
        if (allIngevuld) status = 'submitted';
        else if (hasEntries) status = 'in_progress';

        return {
            number: i + 1,
            start: dates.start,
            end: dates.end,
            daysFilled,
            totalDays: dates.days,
            status
        };
    });

    container.innerHTML = `
        <div class="logboek-layout">
            <aside class="logboek-sidebar">
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

            <main class="logboek-main">
                <h1 class="logboek-title">Logboek - Weekoverzicht</h1>
                <p class="logboek-subtitle">Vul je logboek dagelijks in. Je mentor beoordeelt je logboek per week.</p>

                <div class="logboek-weeks">
                    ${weeks.map(w => {
                        const progress = (w.daysFilled / w.totalDays) * 100;
                        let statusBadge = '';
                        if (w.status === 'submitted') {
                            statusBadge = '<span class="logboek-badge logboek-badge-validated">Ingediend</span>';
                        } else if (w.status === 'in_progress') {
                            statusBadge = '<span class="logboek-badge logboek-badge-pending">Bezig</span>';
                        } else {
                            statusBadge = '<span class="logboek-badge logboek-badge-pending">Nog niet ingediend</span>';
                        }

                        return `
                            <a href="?role=logboek_dag&week=${w.number}" class="logboek-week-card">
                                <div class="logboek-week-left">
                                    <span class="logboek-week-name">Week ${w.number}</span>
                                    <span class="logboek-week-dates">${w.start} t/m ${w.end}</span>
                                </div>
                                <div class="logboek-week-right">
                                    <div class="logboek-week-progress-wrap">
                                        <span class="logboek-week-count">${w.daysFilled}/${w.totalDays} dagen ingevuld</span>
                                        <div class="logboek-week-bar">
                                            <div class="logboek-week-bar-fill" style="width: ${progress}%"></div>
                                        </div>
                                    </div>
                                    ${statusBadge}
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </main>
        </div>
    `;
}
