import './style.css';
import { renderAanvragen } from './stagecommissie/aanvragen.js';
import { renderStudentDashboard } from './student/student.js';
import { renderStageformulier } from './student/formulier.js';
import { renderWachten } from './student/wachten.js';
import { renderFeedback } from './student/feedback.js';
import { renderAanpassen } from './student/aanpassen.js';
import { renderMijnStagiairs } from './stagementor/mijn-stagiairs.js';
import { renderMijnStudenten } from './docent/mijn-studenten.js';
import { renderOverzicht } from './student/overzicht.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');

if (role === 'student') {
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
} else {
  // Portaalpagina om te kiezen welke rol paginas te bekijken
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h1 style="margin-bottom: 2rem; color: #212529;">Stage Monitoring Tool</h1>
      <p style="margin-bottom: 2rem; color: #6c757d; font-size: 1.1rem;">Kies het portaal dat je wilt bekijken:</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <a href="?role=student" style="padding: 1rem 2rem; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Studenten Portaal</a>
        <a href="?role=feedback" style="padding: 1rem 2rem; background-color: #fd7e14; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Feedback Portaal</a>
        <a href="?role=stagecommissie" style="padding: 1rem 2rem; background-color: #198754; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagecommissie Portaal</a>
        <a href="?role=stagementor" style="padding: 1rem 2rem; background-color: #0f766e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagementor Portaal</a>
        <a href="?role=docent" style="padding: 1rem 2rem; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Docent Portaal</a>
        <a href="?role=overzicht" style="padding: 1rem 2rem; background-color: #dc3545; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Overzicht Portaal</a>
      </div>
    </div>
  `;
}
