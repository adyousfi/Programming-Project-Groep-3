import './admin.css';

export function renderAdmin(app) {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active">Gebruikers</a>
          <a href="#" class="nav-item">Koppelingen</a>
          <a href="#" class="nav-item">Documenten</a>
          <a href="#" class="nav-item">Competenties</a>
        </nav>
        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <a href="#" class="logout-link">Uitloggen</a>
        </div>
      </aside>
      <main class="main-content">
        <header class="page-header">
          <h1 class="page-title">Gebruikersbeheer</h1>
          <button class="btn-primary" id="openModal">+ Nieuw account aanmaken</button>
        </header>
        <div class="filters">
          <input type="text" class="search-input" placeholder="Zoek op naam of e-mail...">
          <select class="role-filter">
            <option>Alle rollen</option>
            <option>Student</option>
            <option>Stagecommissie</option>
            <option>EhB-docent</option>
            <option>Stagementor</option>
            <option>Administratie</option>
          </select>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal">
        <h2 class="modal-title">Nieuw account aanmaken</h2>
        <form id="accountForm">
          <div class="form-group">
            <label for="voornaam">Voornaam <span class="required">*</span></label>
            <input type="text" id="voornaam" required>
          </div>
          <div class="form-group">
            <label for="achternaam">Achternaam <span class="required">*</span></label>
            <input type="text" id="achternaam" required>
          </div>
          <div class="form-group">
            <label for="email">E-mailadres <span class="required">*</span></label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="wachtwoord">Wachtwoord <span class="required">*</span></label>
            <div class="password-field">
              <input type="text" id="wachtwoord" required>
              <button type="button" class="btn-generate" id="generatePassword">Genereer</button>
            </div>
          </div>
          <div class="form-group">
            <label for="rol">Rol <span class="required">*</span></label>
            <select id="rol" required>
              <option>Student</option>
              <option>Stagecommissie</option>
              <option>EhB-docent</option>
              <option>Stagementor</option>
              <option>Administratie</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status <span class="required">*</span></label>
            <select id="status" required>
              <option>Actief</option>
              <option>Inactief</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Aanmaken</button>
            <button type="button" class="btn-cancel" id="closeModal">Annuleren</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Modal functionality
  const modal = document.getElementById('modalOverlay');
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const form = document.getElementById('accountForm');
  const generateBtn = document.getElementById('generatePassword');

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
    }
  });

  generateBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('wachtwoord').value = password;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    //  Behandelt form submission hier
    modal.classList.remove('active');
    form.reset();
  });
}
