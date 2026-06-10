import './student.css';
import { logout } from '../utils/auth.js';

export function renderStudentDashboard(container, userName = '[Studentnaam placeholder]') {
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
                    <button id="student-logout-btn" class="logout-link">Uitloggen</button>
                </div>
            </header>

            <main class="dashboard-content">
                <!-- Stepper Section -->
                <section class="stepper-section">
                    <div class="stepper-container">
                        <!-- Step 1 -->
                        <div class="step active">
                            <div class="step-circle">1</div>
                            <div class="step-title">Aanvraag</div>
                            <div class="step-status">Actief</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 2 -->
                        <div class="step">
                            <div class="step-circle">2</div>
                            <div class="step-title">In beoordeling</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 3 -->
                        <div class="step">
                            <div class="step-circle">3</div>
                            <div class="step-title">Goedgekeurd</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 4 -->
                        <div class="step">
                            <div class="step-circle">4</div>
                            <div class="step-title">Stage actief</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 5 -->
                        <div class="step">
                            <div class="step-circle">5</div>
                            <div class="step-title">Evaluatie</div>
                            <div class="step-status">Gepland</div>
                        </div>
                    </div>
                </section>


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

    container.querySelector('#student-logout-btn').addEventListener('click', logout);

    // Event listener voor "Stagevoorstel Indienen" button (paginadirectie)
    const indienenBtn = container.querySelector('.primary-button');
    if (indienenBtn) {
        indienenBtn.addEventListener('click', () => {
            window.location.search = '?role=stageformulier';
        });
    }
}
