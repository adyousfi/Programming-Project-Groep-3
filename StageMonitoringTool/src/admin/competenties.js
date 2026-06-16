import './competenties.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js';
import { renderAdminDocumenten } from './adminDocumenten.js';

/* ✅ TEST DATA (kan je later vervangen door API) */
async function getCompetenties() {
  return [
    { id: 1, code: 'D1', titel: 'Projectbeheer' },
    { id: 2, code: 'D2', titel: 'IT-oplossingen' }
  ];
}

async function getRubriekenByCompetentieId(id) {
  return [
    { id: id * 10 + 1, titel: 'Planning', omschrijving: 'Kan plannen', score: 4 },
    { id: id * 10 + 2, titel: 'Analyse', omschrijving: 'Analyseert goed', score: 5 }
  ];
}

/* ✅ MAIN RENDER */
export async function renderCompetenties(app) {

  app.innerHTML = `<p>Laden...</p>`;

  const competenties = await getCompetenties();

  let html = `
    <div class="app">

      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>Administratie</h1>
          <p>Erasmushogeschool Brussel</p>
        </div>

        <nav class="sidebar-nav">
  <button id="navGebruikers" class="nav-item">Gebruikers</button>
  <button id="navKoppelingen" class="nav-item">Koppelingen</button>
  <button id="navDocumenten" class="nav-item">Documenten</button>
  <button id="navCompetenties" class="nav-item active">Competenties</button>
        </nav>

        <div class="sidebar-footer">
          <p>Admin User</p>
          <button class="logout">Uitloggen</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main">

        <div class="header">
          <div>
            <h2>Competenties beheren</h2>
            <p class="subtitle">
              Pas competenties en weegfactoren aan
            </p>
          </div>
          <button class="btn-primary">+ Competentie toevoegen</button>
        </div>
  `;

  /* ✅ LOOP competenties */
  for (const comp of competenties) {

    const rubrieken = await getRubriekenByCompetentieId(comp.id);

    html += `
      <div class="card">

        <!-- HEADER -->
        <div class="competentie-header">
          <h3>${comp.code} - ${comp.titel}</h3>
          <button class="btn-outline edit-comp-btn" data-id="${comp.id}">
            Bewerken
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Rubriek</th>
              <th>Omschrijving</th>
              <th>Score</th>
              <th>Acties</th>
            </tr>
          </thead>

          <tbody>
    `;

    for (const rubriek of rubrieken) {
      html += `
        <tr>
          <td>${rubriek.titel}</td>
          <td>${rubriek.omschrijving}</td>
          <td>${rubriek.score}</td>
          <td>
            <button class="btn-outline edit-rubriek-btn" data-id="${rubriek.id}">
              Bewerken
            </button>
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  /* ✅ MODAL */
  html += `
      </main>
    </div>

    <div id="editModal" class="modal-overlay">
      <div class="modal">
        <h3>Item bewerken</h3>

        <input id="editInput" placeholder="Nieuwe naam">

        <div class="modal-actions">
          <button class="btn-primary" id="saveEdit">Opslaan</button>
          <button class="btn-outline" id="closeModal">Annuleren</button>
        </div>
      </div>
    </div>
  `;

  app.innerHTML = html;

  /* ✅ NAVIGATIE */
// NAVIGATIE

document.getElementById('navGebruikers').addEventListener('click', (e) => {
  e.preventDefault();
  renderAdmin(app);
});

document.getElementById('navKoppelingen').addEventListener('click', (e) => {
  e.preventDefault();
  renderKoppelingen(app);
});

document.getElementById('navDocumenten')?.addEventListener('click', (e) => {
  e.preventDefault();
  renderAdminDocumenten(app);
});

// deze is current page → mag blijven of opnieuw renderen
document.getElementById('navCompetenties').addEventListener('click', (e) => {
  e.preventDefault();
  renderCompetenties(app);
});

  /* ✅ MODAL LOGIC */
  const modal = document.getElementById('editModal');
  const input = document.getElementById('editInput');

  let currentItemId = null;

  function openModal(value, id) {
    input.value = value;
    currentItemId = id;
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  document.getElementById('closeModal').onclick = closeModal;

  document.getElementById('saveEdit').onclick = () => {
    alert(`Opgeslagen: ${input.value} (id: ${currentItemId})`);
    closeModal();
  };

  /* ✅ EDIT EVENTS */

  // competentie edit
  document.querySelectorAll('.edit-comp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openModal('Competentie aanpassen', id);
    });
  });

  // rubriek edit
  document.querySelectorAll('.edit-rubriek-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openModal('Rubriek aanpassen', id);
    });
  });

  /* ✅ CLOSE op achtergrond click */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}