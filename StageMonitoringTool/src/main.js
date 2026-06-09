import './style.css';
import { renderAanvragen } from './stagecommissie/aanvragen.js';
import { renderStudentDashboard } from './student/student.js';
import { renderStageformulier } from './student/formulier.js';
import { renderWachten } from './student/wachten.js';
import { renderFeedback } from './student/feedback.js';
import { renderAanpassen } from './student/aanpassen.js';
import { renderMijnStagiairs } from './stagementor/mijn-stagiairs.js';
import { renderMijnStudenten } from './docent/mijn-studenten.js';
import { renderGoedgekeurdStudent } from './student/goedgekeurd_student.js';
import { renderDocumenten } from './student/documenten.js';
import { renderDocumentenIngedient } from './student/documenten-ingedient.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');
const loggedInUser = sessionStorage.getItem('loggedInUser');

// Niet ingelogd → toon loginformulier
if (!loggedInUser) {
  renderLoginForm();
}
// Ingelogd + rol in URL → juiste pagina
else if (role === 'student') {
  renderStudentDashboard(app);
} else if (role === 'stageformulier') {
  renderStageformulier(app);
} else if (role === 'wachten') {
  renderWachten(app);
} else if (role === 'feedback') {
  renderFeedback(app);
} else if (role === 'aanpassen') {
  renderAanpassen(app);
} else if (role === 'stagecommissie') {
  renderAanvragen();
} else if (role === 'stagementor') {
  renderMijnStagiairs(app);
} else if (role === 'docent') {
  renderMijnStudenten();
} else if (role === 'overzicht') {
  renderOverzicht(app);
} else if (role === 'frontend') {
  // Front-end portaal: kies welke rol paginas te bekijken
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h1 style="margin-bottom: 1rem; color: #212529;">Stage Monitoring Tool</h1>
      <p style="margin-bottom: 2rem; color: #6c757d;">Ingelogd als: <strong>${loggedInUser}</strong></p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <a href="?role=student" style="padding: 1rem 2rem; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Studenten Portaal</a>
        <a href="?role=feedback" style="padding: 1rem 2rem; background-color: #fd7e14; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Feedback Portaal</a>
        <a href="?role=stagecommissie" style="padding: 1rem 2rem; background-color: #198754; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagecommissie Portaal</a>
        <a href="?role=stagementor" style="padding: 1rem 2rem; background-color: #0f766e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagementor Portaal</a>
        <a href="?role=docent" style="padding: 1rem 2rem; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Docent Portaal</a>
        <a href="?role=overzicht" style="padding: 1rem 2rem; background-color: #dc3545; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Overzicht Portaal</a>
      </div>
      <button id="logout-btn" style="margin-top: 2rem; padding: 0.5rem 1rem; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Uitloggen</button>
    </div>
  `;
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/';
  });
}

function renderLoginForm() {
  app.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: white;">
      <div style="background: #f0f0f0; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); width: 100%; max-width: 400px;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="margin: 0 0 0.5rem 0; color: #212529; font-size: 1.8rem; font-weight: 600;">Stage Monitoring Tool</h1>
          <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">Erasmushogeschool Brussel</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; color: #212529; font-weight: 500;">Email</label>
            <input type="email" id="email-input" placeholder="Voer je email in" required
              style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem; box-sizing: border-box;" />
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; color: #212529; font-weight: 500;">Wachtwoord</label>
            <input type="password" id="password-input" placeholder="Voer je wachtwoord in" required
              style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem; box-sizing: border-box;" />
          </div>
          <button id="login-btn"
            style="padding: 0.75rem; background-color: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 1rem; cursor: pointer; margin-top: 0.5rem;">
            Inloggen
          </button>
        </div>
        <div id="login-error" style="margin-top: 1rem; padding: 0.75rem; border-radius: 6px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; display: none; text-align: center; font-size: 0.9rem;">
          Ongeldige gegevens. Probeer opnieuw.
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-btn').addEventListener('click', async () => {
    const email    = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.style.display = 'none';

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('loggedInUser', data.user.first_name + ' ' + data.user.last_name);
        sessionStorage.setItem('userRole', data.user.role);

        // Doorsturen op basis van rol
        const rolMap = {
          student:       '/?role=student',
          stagecommisie: '/?role=stagecommissie',
          stagementor:   '/?role=stagementor',
          docent:        '/?role=docent',
          admin:         '/'
        };
        window.location.href = rolMap[data.user.role] ?? '/';
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = data.message;
      }
    } catch (err) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Kan geen verbinding maken met de server.';
    }
  });
}
