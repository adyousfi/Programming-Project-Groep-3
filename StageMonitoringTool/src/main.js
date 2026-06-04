import './style.css';
import { renderAanvragen } from './stagecommissie/aanvragen.js';
import { renderStudentDashboard } from './student/student.js';
import { renderStageformulier } from './student/formulier.js';

const app = document.querySelector('#app');
const role = new URLSearchParams(window.location.search).get('role');
const loggedInUser = sessionStorage.getItem('loggedInUser');

// Check if authenticated
if (!loggedInUser && !window.location.search.includes('authenticated')) {
  // Show login form
  renderLoginForm();
} else if (role === 'student') {
  renderStudentDashboard(app, loggedInUser);
} else if (role === 'stageformulier') {
  renderStageformulier(app);
} else if (role === 'stagecommissie') {
  renderAanvragen();
} else if (loggedInUser) {
  // Portaalpagina om te kiezen welke rol paginas te bekijken
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background-color: #f8f9fa;">
      <h1 style="margin-bottom: 1rem; color: #212529; font-size: 2rem;">Stage Monitoring Tool</h1>
      <p style="margin-bottom: 2rem; color: #6c757d; font-size: 1rem;">Ingelogd als: <strong>${loggedInUser}</strong></p>
      <p style="margin-bottom: 2rem; color: #6c757d; font-size: 1.1rem;">Kies het portaal dat je wilt bekijken:</p>
      <div style="display: flex; gap: 1rem;">
        <a href="?role=student" style="padding: 1rem 2rem; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s;">Studenten Portaal</a>
        <a href="?role=stagecommissie" style="padding: 1rem 2rem; background-color: #198754; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s;">Stagecommissie Portaal</a>
      </div>
      <div style="margin-top: 2rem;">
        <button id="logout-btn" style="padding: 0.5rem 1rem; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s;">Uitloggen</button>
      </div>
    </div>
  `;

  document.querySelector('#logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
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

        <form id="login-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label for="username" style="display: block; margin-bottom: 0.5rem; color: #212529; font-weight: 500; font-size: 0.95rem;">Gebruikersnaam</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Voer je gebruikersnaam in" 
              required
              style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s;"
            />
          </div>

          <div>
            <label for="password" style="display: block; margin-bottom: 0.5rem; color: #212529; font-weight: 500; font-size: 0.95rem;">Wachtwoord</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Voer je wachtwoord in" 
              required
              style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 6px; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s;"
            />
          </div>

          <button 
            type="submit" 
            style="padding: 0.75rem 1.5rem; background-color: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background-color 0.2s, transform 0.1s; margin-top: 0.5rem;"
          >
            Inloggen
          </button>
        </form>

        <div id="login-error" style="margin-top: 1rem; padding: 0.75rem; border-radius: 6px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; display: none; text-align: center; font-size: 0.9rem;">
          Ongeldige gegevens. Probeer opnieuw.
        </div>

        <div style="margin-top: 1.5rem; text-align: center; color: #6c757d; font-size: 0.85rem; background-color: #e7f3ff; padding: 0.75rem; border-radius: 6px; border-left: 4px solid #0d6efd;">
          <p style="margin: 0.25rem 0; font-weight: 500; color: #0c5ccc;"><strong>Test credentials:</strong></p>
          <p style="margin: 0.25rem 0; color: #0c5ccc;">Student: <code>student</code> / <code>password123</code></p>
          <p style="margin: 0.25rem 0; color: #0c5ccc;">Commissie: <code>commissie</code> / <code>password123</code></p>
        </div>
      </div>
    </div>
  `;

  // Handle login
  const form = document.querySelector('#login-form');
  const errorDiv = document.querySelector('#login-error');
  const usernameInput = document.querySelector('#username');
  const passwordInput = document.querySelector('#password');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Simple authentication
    if ((username === 'student' && password === 'password123') || 
        (username === 'commissie' && password === 'password123')) {
      
      // Store user info in sessionStorage
      sessionStorage.setItem('loggedInUser', username);
      
      // Redirect to portal selection
      window.location.href = '/?authenticated=true';
    } else {
      errorDiv.style.display = 'block';
      usernameInput.value = '';
      passwordInput.value = '';
      
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 3000);
    }
  });
}
