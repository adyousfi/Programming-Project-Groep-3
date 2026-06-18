export function renderSetPassword(app) {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    app.innerHTML = `
      <div class="login-card">
        <h1 class="login-title">Ongeldige Link</h1>
        <p class="login-subtitle">Er ontbreekt een setup token in de URL.</p>
        <a href="/" class="login-btn" style="text-decoration:none; text-align:center; display:block;">Terug naar login</a>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="login-card">
      <h1 class="login-title">Wachtwoord Instellen</h1>
      <p class="login-subtitle">Kies een nieuw wachtwoord voor je account</p>
      
      <div class="login-field">
        <label class="login-label" for="new-password">Nieuw Wachtwoord</label>
        <input id="new-password" type="password" placeholder="Minimaal 6 tekens" class="login-input">
      </div>
      
      <div class="login-field">
        <label class="login-label" for="confirm-password">Bevestig Wachtwoord</label>
        <input id="confirm-password" type="password" placeholder="Minimaal 6 tekens" class="login-input">
      </div>
      
      <button id="set-pwd-btn" class="login-btn">Instellen</button>
      <p id="set-pwd-msg" class="login-msg"></p>
    </div>
  `;

  const btn = document.getElementById('set-pwd-btn');
  const msg = document.getElementById('set-pwd-msg');

  btn.addEventListener('click', async () => {
    const pwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;

    if (!pwd || !confirmPwd) {
      msg.style.color = 'red';
      msg.textContent = 'Vul beide velden in.';
      return;
    }

    if (pwd !== confirmPwd) {
      msg.style.color = 'red';
      msg.textContent = 'Wachtwoorden komen niet overeen.';
      return;
    }

    if (pwd.length < 6) {
      msg.style.color = 'red';
      msg.textContent = 'Wachtwoord moet minimaal 6 tekens lang zijn.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Bezig...';
    msg.textContent = '';

    try {
      const res = await fetch('/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: pwd })
      });
      const data = await res.json();

      if (data.success) {
        msg.style.color = 'green';
        msg.textContent = 'Wachtwoord succesvol ingesteld! Je wordt omgeleid naar de loginpagina...';
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        msg.style.color = 'red';
        msg.textContent = data.message || 'Fout bij het instellen van wachtwoord.';
        btn.disabled = false;
        btn.textContent = 'Instellen';
      }
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = 'Server fout.';
      btn.disabled = false;
      btn.textContent = 'Instellen';
    }
  });
}
