import './style.css';
import { renderAanvragen }          from './stagecommissie/aanvragen.js';
import { renderStudentDashboard }   from './student/student.js';
import { renderStageformulier }     from './student/formulier.js';
import { renderWachten }            from './student/wachten.js';
import { renderFeedback }           from './student/feedback.js';
import { renderAanpassen }          from './student/aanpassen.js';
import { renderMijnStagiairs }      from './stagementor/mijn-stagiairs.js';
import { renderMijnStudenten }      from './docent/mijn-studenten.js';
import { renderGoedgekeurdStudent } from './student/goedgekeurd_student.js';
import { renderDocumenten }         from './student/documenten.js';
import { renderAdmin }              from './admin/admin.js';

const app       = document.getElementById('app');
const loginPage = document.getElementById('login-page');
const btn       = document.getElementById('btn');
const msg       = document.getElementById('msg');

// ── helpers ──────────────────────────────────────────
function showLogin() {
  loginPage.style.display = 'flex';
  app.style.display       = 'none';
}

function showApp() {
  loginPage.style.display = 'none';
  app.style.display       = 'block';
}

// ── rol → render ──────────────────────────────────────
function redirectBasedOnRole(role) {
  showApp();
  switch (role) {
    case 'admin':               renderAdmin(app);               break;
    case 'student':             renderStudentDashboard(app);    break;
    case 'stageformulier':      renderStageformulier(app);      break;
    case 'wachten':             renderWachten(app);             break;
    case 'feedback':            renderFeedback(app);            break;
    case 'aanpassen':           renderAanpassen(app);           break;
    case 'stagecommisie':      renderAanvragen();              break;
    case 'stagementor':         renderMijnStagiairs(app);       break;
    case 'docent':              renderMijnStudenten();          break;
    case 'goedgekeurd_student': renderGoedgekeurdStudent(app);  break;
    case 'documenten':          renderDocumenten(app);          break;
    default:
      app.innerHTML = `<p style="text-align:center;margin-top:2rem;color:red;">
        Onbekende rol: <strong>${role}</strong>
      </p>`;
  }
}
async function logout() {
  try {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.error('Fout bij uitloggen:', err);
  } finally {
    // ✅ extra zekerheid: cookie ook client-side verwijderen
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  }
}

// ── check cookie bij page load ────────────────────────
async function init() {
  try {
    const res  = await fetch('http://localhost:3000/me', { credentials: 'include' });
    const data = await res.json();

    if (data.loggedIn) {
      redirectBasedOnRole(data.user.role);  // al ingelogd → meteen app tonen
    } else {
      showLogin();                           // niet ingelogd → login tonen
    }
  } catch (err) {
    console.error('Fout bij /me:', err);
    showLogin();
  }
}

// ── login knop ───────────────────────────────────────
btn.addEventListener('click', async () => {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    msg.style.color = 'red';
    msg.textContent = 'Vul alle velden in.';
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Bezig...';
  msg.textContent = '';

  try {
    const res  = await fetch('http://localhost:3000/login', {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      redirectBasedOnRole(data.user.role);  // login gelukt → app tonen
    } else {
      msg.style.color  = 'red';
      msg.textContent  = data.message || 'Foute login';
      btn.disabled     = false;
      btn.textContent  = 'Login';
    }
  } catch (err) {
    msg.style.color  = 'red';
    msg.textContent  = 'Server fout';
    btn.disabled     = false;
    btn.textContent  = 'Login';
  }
});

init();