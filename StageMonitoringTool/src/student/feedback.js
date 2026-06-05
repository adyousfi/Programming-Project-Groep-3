import './feedback.css';

export function renderFeedback(container, userName = '[Studentnaam]') {
    container.innerHTML = `
        <div class="feedback-dashboard">
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
                <!-- Stappen sectie -->
                <section class="stepper-section">
                    <div class="stepper-container">
                        <!-- Step 1: Completed -->
                        <div class="step completed">
                            <div class="step-circle">&#10003;</div>
                            <div class="step-title">Aanvraag</div>
                            <div class="step-status">Voltooid</div>
                        </div>
                        <div class="step-line completed"></div>
                        <!-- Step 2: Actie vereist -->
                        <div class="step action-required">
                            <div class="step-circle">!</div>
                            <div class="step-title">In beoordeling</div>
                            <div class="step-status">Actie vereist</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 3: Actie vereist -->
                        <div class="step action-required">
                            <div class="step-circle">!</div>
                            <div class="step-title">Goedgekeurd</div>
                            <div class="step-status">Actie vereist</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 4: Gepland -->
                        <div class="step">
                            <div class="step-circle">4</div>
                            <div class="step-title">Stage actief</div>
                            <div class="step-status">Gepland</div>
                        </div>
                        <div class="step-line"></div>
                        <!-- Step 5: Gepland -->
                        <div class="step">
                            <div class="step-circle">5</div>
                            <div class="step-title">Evaluatie</div>
                            <div class="step-status">Gepland</div>
                        </div>
                    </div>
                </section>

                <!-- Status Balk -->
                <section class="status-bar">
                    <span class="status-pill">Aanpassingen vereist</span>
                    <p class="status-description">De stagecommissie heeft feedback gegeven op je stagevoorstel</p>
                </section>
            </main>
        </div>
    `;
}
