import './style.css';
import { wrapFetch, clearAuthCache } from './guard.js';
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
import { renderLogboekDag } from './student/logboek-dag.js';
import { renderEvaluatieStudent } from './student/evaluatie.js';
import { renderAdmin } from './admin/admin.js';
import { renderSetPassword } from './auth/set-password.js';

const app = document.querySelector('#app');

/* ─── URL-lek fix: ?role=... omzetten naar schoon pad ──── */
(function fixUrl() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (!role) return;
  params.delete('role');
  const routeMap = {
    student: 'dashboard',
    stagecommisie: 'stagecommissie',
    stagementor: 'stagementor',
    docent: 'docent',
    admin: 'admin',
    goedgekeurd_student: 'goedgekeurd-student',
    documenten_ingedient: 'documenten-ingediend',
    logboek_dag: 'logboek-dag',
  };
  const path = routeMap[role] || role;
  const query = params.toString();
  const suffix = query ? `?${query}` : '';
  window.history.replaceState(null, '', `/${path}${suffix}`);
})();

/* ─── Globale click guard + logout-hantering ──── */
document.addEventListener('click', async (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  const text = link.textContent.trim().toLowerCase();
  if (text === 'uitloggen') {
    e.preventDefault();
    clearAuthCache();
    try { await fetch('/logout', { method: 'POST', credentials: 'include' }); } catch {}
    window.location.href = '/login';
    return;
  }
  const loginPaths = ['/', '/login'];
  if (loginPaths.includes(window.location.pathname)) return;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    const data = await res.json();
    if (!data.loggedIn) {
      e.preventDefault();
      clearAuthCache();
      window.location.href = '/login';
    }
  } catch {
    e.preventDefault();
    clearAuthCache();
    window.location.href = '/login';
  }
});

/* ─── Globale fetch-wrapper voor request-beveiliging ──── */
wrapFetch();

/* ─── Initiele auth-check voor niet-login paginas ──── */
(async function initialAuthCheck() {
  const loginPaths = ['/', '/login'];
  if (loginPaths.includes(window.location.pathname)) return;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    const data = await res.json();
    if (!data.loggedIn) {
      clearAuthCache();
      window.location.href = '/login';
    }
  } catch {
    clearAuthCache();
    window.location.href = '/login';
  }
})();

/* ─── Helpers ──── */
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

/* ─── Routing via pathname ──── */
const path = window.location.pathname.slice(1) || 'login';
const week = parseInt(new URLSearchParams(window.location.search).get('week')) || null;

if (path === 'dashboard') {
  const user = await getLoggedInUser();
  if (user && user.role === 'student') {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    if (!stageData.found) {
      renderStudentDashboard(app, displayName);
    } else {
      switch (stageData.status?.toLowerCase()) {
        case 'in_afwachting':
          renderWachten(app, displayName);
          break;
        case 'goedgekeurd':
          await renderGoedgekeurdStudent(app, displayName, stageData);
          break;
        case 'aanpassingen':
          renderFeedback(app, user, stageData);
          break;
        case 'afgekeurd':
          renderAfkeuring(app, displayName, stageData);
          break;
        default:
          renderWachten(app, displayName);
      }
    }
  } else {
    renderStudentDashboard(app);
  }
} else if (path === 'admin') {
  renderAdmin(app);
} else if (path === 'stageformulier') {
  renderStageformulier(app);
} else if (path === 'wachten') {
  renderWachten(app);
} else if (path === 'feedback') {
  renderFeedback(app);
} else if (path === 'aanpassen') {
  const user = await getLoggedInUser();
  if (user) {
    const stageData = await getStudentStage(user.user_id);
    renderAanpassen(app, user.first_name, stageData.found ? stageData : null);
  } else {
    renderAanpassen(app);
  }
} else if (path === 'afkeuring') {
  renderAfkeuring(app);
} else if (path === 'stagecommissie') {
  renderAanvragen();
} else if (path === 'stagementor') {
  const user = await getLoggedInUser();
  renderMijnStagiairs(app, user);
} else if (path === 'docent') {
  const user = await getLoggedInUser();
  if (user && user.role === 'docent') {
    renderMijnStudenten(app, user);
  } else {
    window.location.href = '/login';
  }
} else if (path === 'goedgekeurd-student') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    await renderGoedgekeurdStudent(app, displayName, stageData.found ? stageData : null);
  } else {
    await renderGoedgekeurdStudent(app);
  }
} else if (path === 'documenten') {
  await renderDocumenten(app);
} else if (path === 'documenten-ingediend') {
  renderDocumentenIngedient(app);
} else if (path === 'stagedetails') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    renderStagedetails(app, displayName, stageData.found ? stageData : null);
  } else {
    renderStagedetails(app);
  }
} else if (path === 'logboek') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    await renderLogboek(app, displayName, stageData.found ? stageData : null);
  } else {
    await renderLogboek(app);
  }
} else if (path === 'logboek-dag') {
  const weekNumber = week || 1;
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const displayName = user.last_name ? `${user.last_name.toUpperCase()} ${user.first_name}` : user.first_name;
    const stageData = await getStudentStage(user.user_id);
    await renderLogboekDag(app, displayName, stageData.found ? stageData : null, weekNumber);
  } else {
    await renderLogboekDag(app, 'Student', null, weekNumber);
  }
} else if (path === 'evaluatie') {
  const user = await getLoggedInUser();
  if (user && user.user_id) {
    const stageData = await getStudentStage(user.user_id);
    await renderEvaluatieStudent(app, user, stageData.found ? stageData : null);
  } else {
    await renderEvaluatieStudent(app, null, null);
  }
} else {
  /* onbekend pad of /login → login pagina tonen */
  if (window.location.pathname !== '/login') {
    window.history.replaceState(null, '', '/login');
  }
  app.style.display = 'none';
  document.querySelector('#login-page').style.display = 'flex';
}

/* ─── Login handler ──── */
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
        const routeMap = {
          student: 'dashboard',
          stagecommisie: 'stagecommissie',
          stagementor: 'stagementor',
          docent: 'docent',
          admin: 'admin',
        };
        const path = routeMap[data.user.role] || data.user.role;
        window.location.href = `/${path}`;
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
