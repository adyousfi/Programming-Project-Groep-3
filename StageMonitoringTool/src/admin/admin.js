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
        </header>
      </main>
    </div>
  `;
}
