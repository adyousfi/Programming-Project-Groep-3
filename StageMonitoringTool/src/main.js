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
import { renderStagedetails } from './student/stagedetails.js';
import { renderLogboek } from './student/logboek.js';
import { renderAdmin } from './admin/admin.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');

document.addEventListener('click', async (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const text = link.textContent.trim().toLowerCase();
  if (text !== 'uitloggen') return;
  e.preventDefault();
  try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
  window.location.href = '/';
});

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
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    renderGoedgekeurdStudent(app, displayName, stageData.found ? stageData : null);
  } else {
    renderGoedgekeurdStudent(app);
  }
} else if (role === 'documenten') {
  await renderDocumenten(app);
} else if (role === 'documenten_ingedient') {
  renderDocumentenIngedient(app);
} else if (role === 'stagedetails') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    renderStagedetails(app, displayName, stageData.found ? stageData : null);
  } else {
    renderStagedetails(app);
  }
} else if (role === 'logboek') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    renderLogboek(app, displayName, stageData.found ? stageData : null);
  } else {
    renderLogboek(app);
  }
} else {
  app.style.display = 'none';
  document.querySelector('#login-page').style.display = 'flex';
}

const loginBtn = document.getElementById('btn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const msg           = document.getElementById('msg');
    const email         = emailInput.value.trim();
    const password      = passwordInput.value;

    if (!email || !password) {
      msg.style.color   = 'red';
      msg.textContent   = 'Vul alle velden in.';
      return;
    }

    loginBtn.disabled    = true;
    loginBtn.textContent = 'Bezig...';
    msg.textContent      = '';

    try {
      const res  = await fetch('/login', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = `/?role=${encodeURIComponent(data.user.role)}`;
      } else {
        msg.style.color      = 'red';
        msg.textContent      = data.message || 'Foute login';
        loginBtn.disabled    = false;
        loginBtn.textContent = 'Login';
      }
    } catch {
      msg.style.color      = 'red';
      msg.textContent      = 'Server fout';
      loginBtn.disabled    = false;
      loginBtn.textContent = 'Login';
    }
  });
}
