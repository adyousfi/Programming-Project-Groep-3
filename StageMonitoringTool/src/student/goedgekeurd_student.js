import './goedgekeurd_student.css';

export async function renderGoedgekeurdStudent(container, userName = 'Jan Janssens', stageData = null) {
    const bedrijfNaam = stageData?.bedrijf?.naam || 'Onbekend';
    const bedrijfAdres = stageData?.bedrijf?.adres || '';
    const startDatum = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Nog niet vastgelegd';
    const eindDatum = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde).toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Nog niet vastgelegd';
    const omschrijving = stageData?.stageDetails?.omschrijving || '';
    const docValidated = stageData?.document_validated || false;

    const startDate = stageData?.stageDetails?.start ? new Date(stageData.stageDetails.start) : null;
    const endDate = stageData?.stageDetails?.einde ? new Date(stageData.stageDetails.einde) : null;

    let totalWeeks = 16;
    let submittedWeeks = 0;

    if (startDate && endDate) {
        totalWeeks = 1;
        const nextStart = new Date(startDate);
        nextStart.setHours(12, 0, 0, 0);
        const startDay = nextStart.getDay();
        const daysToMonday = startDay === 1 ? 7 : 8 - startDay;
        nextStart.setDate(nextStart.getDate() + daysToMonday);
        const endObj = new Date(endDate);
        endObj.setHours(12, 0, 0, 0);
        while (nextStart <= endObj) {
            totalWeeks++;
            nextStart.setDate(nextStart.getDate() + 7);
        }
    }

    if (stageData?.id) {
        try {
            const res = await fetch(`/api/logboek/stage/${stageData.id}`, { credentials: 'include' });
            const entries = await res.json();
            if (Array.isArray(entries)) {
                let gevinktWeeks = 0;
                for (let w = 0; w < totalWeeks; w++) {
                    const weekStart = new Date(startDate);
                    weekStart.setDate(startDate.getDate() + w * 7);
                    while (weekStart.getDay() === 0 || weekStart.getDay() === 6) {
                        weekStart.setDate(weekStart.getDate() + 1);
                    }
                    const weekEnd = new Date(weekStart);
                    let count = 1;
                    while (count < 4) {
                        weekEnd.setDate(weekEnd.getDate() + 1);
                        if (weekEnd.getDay() !== 0 && weekEnd.getDay() !== 6) count++;
                    }

                    const weekEntries = entries.filter(e => {
                        if (!e.datum) return false;
                        const d = new Date(e.datum);
                        return d >= weekStart && d <= weekEnd;
                    });

                    if (weekEntries.length > 0 && weekEntries.every(e => e.status === 'INGEVULD' && e.gevinkt_door_stagementor)) {
                        gevinktWeeks++;
                    }
                }
                submittedWeeks = gevinktWeeks;
            }
        } catch (err) {
            console.error('Error fetching logboek:', err);
        }
    }

    let evalAvailable = false;
    let studentSubmitted = false;
    let docentSubmitted = false;
    let finaleAvailable = false;
    let finaleStudentSubmitted = false;
    let finaleDocentSubmitted = false;
    if (docValidated && stageData?.id) {
        try {
            const evalRes = await fetch(`/api/evaluaties/tussentijds-status?stage_id=${stageData.id}`, { credentials: 'include', cache: 'no-store' });
            const evalData = await evalRes.json();
            evalAvailable = evalData.bestaatDoorDocent === true;
        } catch (err) {
            console.error('Error fetching evaluatie status:', err);
        }
        if (evalAvailable) {
            try {
                const statusRes = await fetch(`/api/evaluaties/status?stage_id=${stageData.id}&type_evaluatie=tussentijds`, { credentials: 'include', cache: 'no-store' });
                const statusData = await statusRes.json();
                studentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_student);
                docentSubmitted = statusData.evaluaties && statusData.evaluaties.length > 0
                    && statusData.evaluaties.every((e) => e.ingediend_docent);
            } catch (_) {}
        }
        try {
            const finaleRes = await fetch(`/api/evaluaties/status?stage_id=${stageData.id}&type_evaluatie=finale`, { credentials: 'include', cache: 'no-store' });
            const finaleStatusData = await finaleRes.json();
            finaleAvailable = finaleStatusData.bestaat === true
                && finaleStatusData.evaluaties && finaleStatusData.evaluaties.length > 0
                && finaleStatusData.evaluaties.some((e) => e.docent_id != null);
            if (finaleAvailable) {
                finaleStudentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_student);
                finaleDocentSubmitted = finaleStatusData.evaluaties.every((e) => e.ingediend_docent);
            }
        } catch (err) {
            console.error('Error fetching finale evaluatie status:', err);
        }
    }

    const anyEvalAvailable = evalAvailable || finaleAvailable;
    const anyNewEval = (evalAvailable && (!studentSubmitted || docentSubmitted))
        || (finaleAvailable && (!finaleStudentSubmitted || finaleDocentSubmitted));
    const allLogboeksDone = submittedWeeks === totalWeeks && totalWeeks > 0;

    const logboekProgress = totalWeeks > 0 ? (submittedWeeks / totalWeeks) * 100 : 0;

    container.innerHTML = `
        <div class="goedgekeurd-layout">
            <!-- Linkerzijbalk -->
            <aside class="goedgekeurd-sidebar">
                <div class="sidebar-top">
                    <div class="sidebar-logo">
                        <span class="sidebar-logo-title">Stage Monitoring</span>
                        <span class="sidebar-logo-sub">Erasmushogeschool Brussel</span>
                    </div>
                    <nav class="sidebar-nav">
                        <a href="?role=goedgekeurd_student" class="sidebar-nav-item active">Overzicht</a>
                        <a href="?role=stagedetails" class="sidebar-nav-item">Stagedetails</a>
                        <a href="?role=documenten" class="sidebar-nav-item">Documenten</a>
                        <a href="${docValidated ? '?role=logboek' : '#'}" class="sidebar-nav-item${docValidated ? '' : ' disabled'}">Logboek</a>
                        <a href="${docValidated && anyEvalAvailable ? '?role=evaluatie' : '#'}" class="sidebar-nav-item${docValidated && anyEvalAvailable ? '' : ' disabled'}">Evaluatie${anyNewEval ? ' <span class="sidebar-badge">Nieuw</span>' : ''}</a>
                    </nav>
                </div>
                <div class="sidebar-bottom">
                    <span class="sidebar-user-name">${userName}</span>
                    <a href="/" class="sidebar-logout">Uitloggen</a>
                </div>
            </aside>

            <!-- Hoofdinhoud -->
            <main class="goedgekeurd-main">
                <h1 class="page-title">Stage Voortgang</h1>

                <!-- Voortgangsbalk (Stepper) -->
                <div class="stepper-wrapper">
                    <div class="stepper">
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Aanvraag</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line completed"></div>
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <span class="step-label">Goedgekeurd</span>
                            <span class="step-sub">Voltooid</span>
                        </div>
                        <div class="step-line ${docValidated ? 'completed' : ''}"></div>
                        <div class="step${docValidated ? ' completed' : ' active'}">
                            <div class="step-circle">${docValidated ? '&#10003;' : '3'}</div>
                            <span class="step-label">Document</span>
                            <span class="step-sub">${docValidated ? 'Voltooid' : 'Actief'}</span>
                        </div>
                        <div class="step-line"></div>
                        <div class="step${docValidated ? ' next-active' : ''}${allLogboeksDone ? ' completed-logboek' : ''}">
                            <div class="step-circle step-icon-logboek">${docValidated ? '&#128203;' : '4'}</div>
                            <span class="step-label">Logboek</span>
                            <span class="step-sub">${docValidated ? `${submittedWeeks}/${totalWeeks} weken` : 'Gepland'}</span>
                        </div>

                        <div class="step-line"></div>
                        <div class="step${allLogboeksDone ? ' next-active' : ''}${(finaleAvailable && finaleStudentSubmitted) ? ' completed' : ''}">
                            <div class="step-circle">${(finaleAvailable && finaleStudentSubmitted) ? '&#10003;' : '5'}</div>
                            <span class="step-label">Evaluatie</span>
                            <span class="step-sub">${(finaleAvailable && finaleStudentSubmitted) ? 'Voltooid' : (allLogboeksDone ? 'Actief' : 'Gepland')}</span>
                        </div>

                    </div>
                </div>

                <!-- Info Cards Sectie -->
                <section class="info-cards-section">
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Stage Periode</span>
                            <span class="info-card-icon">&#128197;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main">${startDatum} - ${eindDatum}</span>
                            <span class="info-card-sub">${stageData?.stageDetails?.start && stageData?.stageDetails?.einde ? 'Stage goedgekeurd' : 'Wacht op vastlegging'}</span>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Logboek Status</span>
                            <span class="info-card-icon">&#128203;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main"><span class="logboek-count">${submittedWeeks}</span> / ${totalWeeks} weken</span>
                            <div class="logboek-progress-bar">
                                <div class="logboek-progress-fill" style="width: ${logboekProgress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-header">
                            <span class="info-card-title">Bedrijf</span>
                            <span class="info-card-icon">&#127970;</span>
                        </div>
                        <div class="info-card-content">
                            <span class="info-card-main">${bedrijfNaam}</span>
                            <span class="info-card-sub">${bedrijfAdres || 'Locatie nog niet opgegeven'}</span>
                        </div>
                    </div>
                </section>

                <!-- Actie Kaarten Sectie -->
                <section class="coming-soon-section">
                    <div class="coming-soon-cards">
                        <a href="${docValidated ? '?role=logboek' : '#'}" class="coming-soon-card${docValidated ? ' active-card' : ''}${docValidated ? '' : ' disabled-card'}">
                            <div class="coming-soon-icon${docValidated ? ' active-icon' : ''}">&#128203;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title${docValidated ? ' active-title' : ''}">Logboek Invullen</h3>
                                <p class="coming-soon-sub${docValidated ? ' active-sub' : ''}">${submittedWeeks}/${totalWeeks} weken ingevuld</p>
                            </div>
                        </a>
                        <a href="${anyEvalAvailable ? '?role=evaluatie' : '#'}" class="coming-soon-card${anyEvalAvailable ? ' active-card' : ' disabled-card'}">
                            <div class="coming-soon-icon${anyEvalAvailable ? ' active-icon' : ''}">&#128202;</div>
                            <div class="coming-soon-content">
                                <h3 class="coming-soon-title${anyEvalAvailable ? ' active-title' : ''}">Evaluaties${anyNewEval ? ' <span class="sidebar-badge">Nieuw</span>' : ''}</h3>
                                <p class="coming-soon-sub${anyEvalAvailable ? ' active-sub' : ''}">${anyEvalAvailable ? (() => {
                                    const parts = [];
                                    if (evalAvailable) parts.push(docentSubmitted ? 'Tussentijdse evaluatie ingediend' : (studentSubmitted ? 'Tussentijdse evaluatie reeds ingediend' : 'Tussentijdse evaluatie beschikbaar'));
                                    if (finaleAvailable) parts.push(finaleDocentSubmitted ? 'Finale evaluatie ingediend' : (finaleStudentSubmitted ? 'Finale evaluatie reeds ingediend' : 'Finale evaluatie beschikbaar'));
                                    return parts.join(' · ');
                                })() : 'Bekijk je voortgang en feedback'}</p>
                            </div>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    `;
}
