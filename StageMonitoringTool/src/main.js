import './style.css';
import { renderAanvragen } from './stagecommissie/aanvragen.js';
import { renderStudentDashboard } from './student/student.js';
import { renderStageformulier } from './student/formulier.js';
import { renderWachten } from './student/wachten.js';
import { renderFeedback } from './student/feedback.js';
import { renderAanpassen } from './student/aanpassen.js';
import { renderAfkeuring } from './student/afkeuring.js';
import { renderMijnStagiairs } from './stagementor/mijn-stagiairs.js';
import { renderMijnStudenten } from './docent/mijn-studenten.js';
import { renderGoedgekeurdStudent } from './student/goedgekeurd_student.js';
import { renderDocumenten } from './student/documenten.js';
import { renderDocumentenIngedient } from './student/documenten-ingedient.js';
import { renderAdmin } from './admin/admin.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');

async function getLoggedInUser() {
  try {
    const res = await fetch('/me', { credentials: 'include' });
    const data = await res.json();
    if (data.loggedIn) return data.user;
    return null;
  } catch { return null; }
}

async function getStudentStage(studentId) {
  try {
    const res = await fetch(`/api/stages/student/${studentId}`, { credentials: 'include' });
    return await res.json();
  } catch { return { found: false }; }
}

if (role === 'student') {
  const user = await getLoggedInUser();
  if (user && user.role === 'student') {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    if (!stageData.found) {
      renderStudentDashboard(app, displayName);
    } else {
      switch (stageData.rawStatus) {
        case 'Aanvraag':
          renderWachten(app, displayName);
          break;
        case 'Goedgekeurd':
          renderGoedgekeurdStudent(app, displayName, stageData);
          break;
        case 'Aanpassingen_vereist':
          renderFeedback(app, user, stageData);
          break;
        case 'Afgekeurd':
          renderAfkeuring(app, displayName, stageData);
          break;
        default:
          renderWachten(app, displayName);
      }
    }
  } else {
    renderStudentDashboard(app);
  }
} else if (role === 'admin') {
  renderAdmin(app);
} else if (role === 'stageformulier') {
  renderStageformulier(app);
} else if (role === 'wachten') {
  renderWachten(app);
} else if (role === 'feedback') {
  renderFeedback(app);
} else if (role === 'aanpassen') {
  const user = await getLoggedInUser();
  if (user) {
    const stageData = await getStudentStage(user.user_id);
    renderAanpassen(app, user.first_name, stageData.found ? stageData : null);
  } else {
    renderAanpassen(app);
  }
} else if (role === 'afkeuring') {
  renderAfkeuring(app);
} else if (role === 'stagecommisie') {
  renderAanvragen();
} else if (role === 'stagementor') {
  renderMijnStagiairs(app);
} else if (role === 'docent') {
  renderMijnStudenten();
} else if (role === 'goedgekeurd_student') {
  renderGoedgekeurdStudent(app);
} else if (role === 'documenten') {
  renderDocumenten(app);
} else if (role === 'documenten_ingedient') {
  renderDocumentenIngedient(app);
} else if (role === 'frontend') {
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h1 style="margin-bottom: 2rem; color: #212529;">Stage Monitoring Tool</h1>
      <p style="margin-bottom: 2rem; color: #6c757d; font-size: 1.1rem;">Kies het portaal dat je wilt bekijken:</p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <a href="?role=student" style="padding: 1rem 2rem; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Studenten Portaal</a>
        <a href="?role=feedback" style="padding: 1rem 2rem; background-color: #fd7e14; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Feedback Portaal</a>
        <a href="?role=stagecommisie" style="padding: 1rem 2rem; background-color: #198754; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagecommissie Portaal</a>
        <a href="?role=stagementor" style="padding: 1rem 2rem; background-color: #0f766e; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Stagementor Portaal</a>
        <a href="?role=docent" style="padding: 1rem 2rem; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Docent Portaal</a>
        <a href="?role=admin" style="padding: 1rem 2rem; background-color: #6b7280; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Admin Portaal</a>
        <a href="?role=goedgekeurd_student" style="padding: 1rem 2rem; background-color: #dc3545; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Goedgekeurd Student</a>
      </div>
    </div>
  `;
} else if (role === 'backend') {
  document.querySelector('#login-page').style.display = 'flex';
  app.innerHTML = '';
} else {
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h1 style="margin-bottom: 1rem; color: #212529;">Stage Monitoring Tool</h1>
      <p style="margin-bottom: 2.5rem; color: #6c757d; font-size: 1.1rem;">Selecteer een portaal:</p>
      <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
        <a href="?role=frontend" style="display: flex; flex-direction: column; align-items: center; padding: 2rem 3rem; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 1.3rem; box-shadow: 0 6px 12px rgba(0,0,0,0.15); min-width: 200px; transition: transform 0.2s;">
          Front-end
          <span style="font-size: 0.85rem; font-weight: normal; margin-top: 0.5rem; opacity: 0.9;">Bekijk de portalen</span>
        </a>
        <a href="?role=backend" style="display: flex; flex-direction: column; align-items: center; padding: 2rem 3rem; background-color: #198754; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 1.3rem; box-shadow: 0 6px 12px rgba(0,0,0,0.15); min-width: 200px; transition: transform 0.2s;">
          Back-end
          <span style="font-size: 0.85rem; font-weight: normal; margin-top: 0.5rem; opacity: 0.9;">Inloggen</span>
        </a>
      </div>
    </div>
  `;
}
