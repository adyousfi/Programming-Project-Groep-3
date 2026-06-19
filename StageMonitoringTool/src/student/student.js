import './student.css';


export async function renderStudentDashboard(container, userName = '') {
    if (!userName) {
        try {
            const res = await fetch('/me', { credentials: 'include' });
            const data = await res.json();
            if (data.loggedIn && data.user) {
                userName = (data.user.last_name && data.user.first_name)
                    ? `${data.user.last_name.toUpperCase()} ${data.user.first_name}`
                    : data.user.first_name || 'Student';
            }
        } catch {
            userName = 'Student';
        }
    }

    container.innerHTML = `
        <div class="student-dashboard">
            <!-- Header Sectie -->
            <header class="dashboard-header">
                <div class="brand">
                    <h1 class="brand-title">Stage Monitoring</h1>
                    <span class="brand-subtitle">Erasmushogeschool Brussel</span>
                </div>
                <div class="user-profile">
                    <span class="user-name" id="user-name-display">${userName}</span>
                    <a href="/" class="logout-link">Uitloggen</a>
                </div>
            </header>

            <main class="dashboard-content">
                <!-- Voortgangsbalk (Stepper) -->
                <div class="stepper-wrapper">
                    <div class="stepper">
                        <!-- Step 1 -->
                        <div class="step completed">
                            <div class="step-circle">1</div>
                            <span class="step-label">Aanvraag</span>
                            <span class="step-sub">Actief</span>
                        </div>
                        <div class="step-line completed"></div>
                        <!-- Step 2 -->
                        <div class="step">
                            <div class="step-circle">2</div>
                            <span class="step-label">In beoordeling</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 3 -->
                        <div class="step">
                            <div class="step-circle">3</div>
                            <span class="step-label">Goedgekeurd</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 4 -->
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span class="step-label">Stage actief</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 5 -->
                        <div class="step">
                            <div class="step-circle">5</div>
                            <span class="step-label">Evaluatie</span>
                            <span class="step-sub">Gepland</span>
                        </div>
                    </div>
                </div>


                <section class="welcome-section">
                    <h2 class="welcome-title">Welkom, <span class="welcome-name">${userName}</span></h2>
                    <p class="welcome-subtitle">Je hebt nog geen stage aangevraagd</p>
                </section>

                <!-- Actie Kaart Sectie -->
                <section class="action-section">
                    <div class="action-card">
                        <div class="icon-circle">
                            <span class="plus-icon">+</span>
                        </div>
                        <h3 class="card-title">Nieuwe Stage Aanvragen</h3>
                        <p class="card-subtitle">Dien een stagevoorstel in om te beginnen</p>
                        <button class="primary-button">Stagevoorstel Indienen</button>
                    </div>
                </section>
            </main>
        </div>
    `;

    // Event listener voor "Stagevoorstel Indienen" button (paginadirectie)
    const indienenBtn = container.querySelector('.primary-button');
    if (indienenBtn) {
        indienenBtn.addEventListener('click', () => {
            window.location.pathname = '/stageformulier';
        });
    }
}
