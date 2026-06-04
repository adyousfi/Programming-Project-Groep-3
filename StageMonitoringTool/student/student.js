import './student.css';

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
                    <a href="#" class="logout-link">Uitloggen</a>
                </div>
            </header>
            
            
            <main class="dashboard-content">
            </main>
        </div>
    `;
}
