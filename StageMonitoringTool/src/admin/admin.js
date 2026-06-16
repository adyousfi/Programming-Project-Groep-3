import './admin.css';
import { renderKoppelingen } from './koppeldocent.js';
import { renderAdminDocumenten } from './adminDocumenten.js';
import { renderCompetenties } from './competenties.js';



const API_URL = 'http://localhost:3000';

const roleDisplayMap = {
  'student': 'Student',
  'docent': 'EhB-docent',
  'stagementor': 'Stagementor',
  'stagecommisie': 'Stagecommissie',
  'admin': 'Administratie'
};  

export function renderAdmin(app) {
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active" id="navGebruikers">Gebruikers</a>
          <a href="#" class="nav-item" id="navKoppelingen">Koppelingen</a>
          <a href="#" class="nav-item" id="navDocumenten">Documenten</a>
          <a href="#" class="nav-item" id="navCompetenties">Competenties</a>
        </nav>
        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <a href="/" class="logout-link">Uitloggen</a>
        </div>
      </aside>
      <main class="main-content">
        <header class="page-header">
          <h1 class="page-title">Gebruikersbeheer</h1>
          <button class="btn-primary" id="openModal">+ Nieuw account aanmaken</button>
        </header>
        <div class="filters">
          <input type="text" class="search-input" id="searchInput" placeholder="Zoek op naam of e-mail...">
          <select class="role-filter" id="roleFilter">
            <option value="">Alle rollen</option>
            <option value="student">Student</option>
            <option value="stagecommisie">Stagecommissie</option>
            <option value="docent">EhB-docent</option>
            <option value="stagementor">Stagementor</option>
            <option value="admin">Administratie</option>
          </select>
        </div>
        <div class="table-container">
          <table class="user-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>E-mailadres</th>
                <th>Telefoon</th>
                <th>Rol</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody id="userTableBody">
              <tr><td colspan="6" class="loading">Laden...</td></tr>
            </tbody>
          </table>
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
            <label for="telefoon">Telefoonnummer</label>
            <input type="tel" id="telefoon">
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
              <option value="student">Student</option>
              <option value="stagecommisie">Stagecommissie</option>
              <option value="docent">EhB-docent</option>
              <option value="stagementor">Stagementor</option>
              <option value="admin">Administratie</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status <span class="required">*</span></label>
            <select id="status" required>
              <option value="actief">Actief</option>
              <option value="inactief">Inactief</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Aanmaken</button>
            <button type="button" class="btn-cancel" id="closeModal">Annuleren</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="editModal">
      <div class="modal">
        <h2 class="modal-title">Gebruiker bewerken</h2>
        <form id="editForm">
          <input type="hidden" id="edit-user-id">
          <div class="form-group">
            <label for="edit-voornaam">Voornaam <span class="required">*</span></label>
            <input type="text" id="edit-voornaam" required>
          </div>
          <div class="form-group">
            <label for="edit-achternaam">Achternaam <span class="required">*</span></label>
            <input type="text" id="edit-achternaam" required>
          </div>
          <div class="form-group">
            <label for="edit-email">E-mailadres <span class="required">*</span></label>
            <input type="email" id="edit-email" required>
          </div>
          <div class="form-group">
            <label for="edit-telefoon">Telefoonnummer</label>
            <input type="tel" id="edit-telefoon">
          </div>
          <div class="form-group">
            <label for="edit-wachtwoord">Wachtwoord</label>
            <div class="password-field">
              <input type="text" id="edit-wachtwoord" placeholder="Laat leeg om niet te wijzigen">
              <button type="button" class="btn-generate" id="editGeneratePassword">Genereer</button>
            </div>
          </div>
          <div class="form-group">
            <label for="edit-rol">Rol <span class="required">*</span></label>
            <select id="edit-rol" required>
              <option value="student">Student</option>
              <option value="stagecommisie">Stagecommissie</option>
              <option value="docent">EhB-docent</option>
              <option value="stagementor">Stagementor</option>
              <option value="admin">Administratie</option>
            </select>
          </div>
          <div class="form-group">
            <label for="edit-status">Status <span class="required">*</span></label>
            <select id="edit-status" required>
              <option value="actief">Actief</option>
              <option value="inactief">Inactief</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Bijwerken</button>
            <button type="button" class="btn-cancel" id="closeEditModal">Annuleren</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Elements
  const modal = document.getElementById('modalOverlay');
  const editModal = document.getElementById('editModal');
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const closeEditBtn = document.getElementById('closeEditModal');
  const form = document.getElementById('accountForm');
  const editForm = document.getElementById('editForm');
  const generateBtn = document.getElementById('generatePassword');
  const editGenerateBtn = document.getElementById('editGeneratePassword');
  const searchInput = document.getElementById('searchInput');
  const roleFilter = document.getElementById('roleFilter');
  const tableBody = document.getElementById('userTableBody');

  let allUsers = [];

  // Load users from database
  async function loadUsers() {
    try {
      const response = await fetch(`${API_URL}/select-user`);
      const result = await response.json();
      if (response.ok) {
        allUsers = result.data || [];
        renderUsers(allUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      tableBody.innerHTML = '<tr><td colspan="6" class="loading">Kan gebruikers niet laden</td></tr>';
    }
  }

  // Render users to table
  function renderUsers(users) {
    if (users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="loading">Geen gebruikers gevonden</td></tr>';
      return;
    }

    tableBody.innerHTML = users.map(user => `
      <tr>
        <td>${user.first_name} ${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.phone || '-'}</td>
        <td><span class="role-badge">${roleDisplayMap[user.role] || user.role}</span></td>
        <td class="actions">
          <button class="btn-edit" data-id="${user.user_id}">Bewerken</button>
          <button class="btn-deactivate" data-id="${user.user_id}">Deactiveren</button>
        </td>
      </tr>
    `).join('');

    // Add edit button listeners
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });
    const navGebruikers = document.getElementById('navGebruikers');
    const navKoppelingen = document.getElementById('navKoppelingen');
    const navDocumenten = document.getElementById('navDocumenten');
    const navCompetenties = document.getElementById('navCompetenties');

    navGebruikers.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdmin(app);
    });

    navKoppelingen.addEventListener('click', (e) => {
      e.preventDefault();
      renderKoppelingen(app);
    });

    navDocumenten.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdminDocumenten(app);
    });

    // Competenties: fallback (if not implemented, don't break navigation)
    navCompetenties.addEventListener('click', (e) => {
      e.preventDefault();
      renderCompetenties(app);
    });

    // Add delete button listeners
    document.querySelectorAll('.btn-deactivate').forEach(btn => {
      btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
  }

  // Delete user
  async function deleteUser(userId) {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return;

    try {
      const response = await fetch(`${API_URL}/delete-user/${userId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        alert('Gebruiker succesvol verwijderd!');
        loadUsers();
      } else {
        alert('Fout bij het verwijderen: ' + (result.msg || 'Onbekende fout'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Kan geen verbinding maken met de server.');
    }
  }

  // Filter users
  function filterUsers() {
    const search = searchInput.value.toLowerCase();
    const role = roleFilter.value;

    const filtered = allUsers.filter(user => {
      const matchesSearch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(search) ||
                           user.email.toLowerCase().includes(search);
      const matchesRole = !role || user.role === role;
      return matchesSearch && matchesRole;
    });

    renderUsers(filtered);
  }

  searchInput.addEventListener('input', filterUsers);
  roleFilter.addEventListener('change', filterUsers);

  // Open edit modal with user data
  function openEditModal(userId) {
    const user = allUsers.find(u => u.user_id == userId);
    if (!user) return;

    document.getElementById('edit-user-id').value = user.user_id;
    document.getElementById('edit-voornaam').value = user.first_name;
    document.getElementById('edit-achternaam').value = user.last_name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-telefoon').value = user.phone || '';
    document.getElementById('edit-wachtwoord').value = '';
    document.getElementById('edit-rol').value = user.role;

    editModal.classList.add('active');
  }

  // Modal functionality
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
  });

  closeEditBtn.addEventListener('click', () => {
    editModal.classList.remove('active');
    editForm.reset();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      form.reset();
    }
  });

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.classList.remove('active');
      editForm.reset();
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

  editGenerateBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('edit-wachtwoord').value = password;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      first_name: document.getElementById('voornaam').value,
      last_name: document.getElementById('achternaam').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('telefoon').value || 'no phone',
      password: document.getElementById('wachtwoord').value,
      role: document.getElementById('rol').value
    };

    try {
      const response = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok) {
        modal.classList.remove('active');
        form.reset();
        alert('Gebruiker succesvol aangemaakt!');
        loadUsers();
      } else {
        alert('Fout bij het aanmaken: ' + (result.msg || 'Onbekende fout'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Kan geen verbinding maken met de server.');
    }
  });

  // Update user
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    const userData = {
      first_name: document.getElementById('edit-voornaam').value,
      last_name: document.getElementById('edit-achternaam').value,
      email: document.getElementById('edit-email').value,
      phone: document.getElementById('edit-telefoon').value || 'no phone',
      password: document.getElementById('edit-wachtwoord').value,
      role: document.getElementById('edit-rol').value
    };

    try {
      const response = await fetch(`${API_URL}/update-user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok) {
        editModal.classList.remove('active');
        editForm.reset();
        alert('Gebruiker succesvol bijgewerkt!');
        loadUsers();
      } else {
        alert('Fout bij het bijwerken: ' + (result.msg || 'Onbekende fout'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Kan geen verbinding maken met de server.');
    }
  });

  // Load users on page load
  loadUsers();
}
