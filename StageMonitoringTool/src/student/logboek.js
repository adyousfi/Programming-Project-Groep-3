import './logboek.css';

export function renderLogboek(container, userName = 'Student', stageData = null) {
    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;

    function getWeekDates(weekIndex) {
        if (!startDate) return { start: '?', end: '?' };
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + weekIndex * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4);
        const opts = { day: 'numeric', month: 'short' };
        return {
            start: weekStart.toLocaleDateString('nl-BE', opts),
            end: weekEnd.toLocaleDateString('nl-BE', opts)
        };
    }

    const weeks = Array.from({ length: 16 }, (_, i) => {
        const dates = getWeekDates(i);
        return {
            number: i + 1,
            start: dates.start,
            end: dates.end,
            daysFilled: 0,
            totalDays: 5,
            status: 'not_submitted'
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
                        if (w.status === 'validated') {
                            statusBadge = '<span class="logboek-badge logboek-badge-validated">Afgevinkt door mentor</span>';
                        } else {
                            statusBadge = '<span class="logboek-badge logboek-badge-pending">Nog niet ingediend</span>';
                        }

                        return `
                            <div class="logboek-week-card">
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
                            </div>
                        `;
                    }).join('')}
                </div>
            </main>
        </div>
    `;
}
