import './competenties.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js';
import { renderAdminDocumenten } from './adminDocumenten.js';

/* ✅ TEST DATA */
async function getCompetenties() {
  return [
    { id: 1, code: 'D1', titel: 'Projectbeheer', omschrijving: 'Planning en organisatie', gewicht: 1 },
    { id: 2, code: 'D2', titel: 'IT-oplossingen', omschrijving: 'Software ontwikkeling', gewicht: 2 }
  ];
}

async function getRubriekenByCompetentieId(id) {
  return [
    { id: id * 10 + 1, titel: 'Planning', omschrijving: 'Kan plannen', score: 4 },
    { id: id * 10 + 2, titel: 'Analyse', omschrijving: 'Analyseert goed', score: 5 }
  ];
}

/* ✅ MAIN */
export async function renderCompetenties(app) {

  app.innerHTML = `<p>Laden...</p>`;
  const competenties = await getCompetenties();

  let html = `
    <div class="app">

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

      <main class="main">

        <div class="header">
          <div>
            <h2>Competenties beheren</h2>
            <p class="subtitle">Pas competenties aan</p>
          </div>
          <button class="btn-primary">+ Competentie toevoegen</button>
        </div>
  `;

  for (const comp of competenties) {

    const rubrieken = await getRubriekenByCompetentieId(comp.id);

    html += `
      <div class="card">

        <div class="competentie-header">
          <h3>${comp.code} - ${comp.titel}</h3>
          <button class="btn-outline edit-comp-btn"
            data-id="${comp.id}"
            data-code="${comp.code}"
            data-titel="${comp.titel}"
            data-omschrijving="${comp.omschrijving}"
            data-gewicht="${comp.gewicht}">
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
            <button class="btn-outline edit-rubriek-btn"
              data-id="${rubriek.id}"
              data-titel="${rubriek.titel}"
              data-omschrijving="${rubriek.omschrijving}"
              data-score="${rubriek.score}">
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

  html += `
      </main>
    </div>

    <!-- ✅ MODAL -->
    <div id="editModal" class="modal-overlay">
      <div class="modal" id="modalContent"></div>
    </div>
  `;

  app.innerHTML = html;

  /* ✅ NAVIGATIE */
  document.getElementById('navGebruikers').onclick = () => renderAdmin(app);
  document.getElementById('navKoppelingen').onclick = () => renderKoppelingen(app);
  document.getElementById('navDocumenten').onclick = () => renderAdminDocumenten(app);

  /* ✅ MODAL */
  const modal = document.getElementById('editModal');
  const modalContent = document.getElementById('modalContent');

  let currentType = null;
  let currentId = null;

  function openModal(type, data) {
    currentType = type;
    currentId = data.id;

    if (type === 'competentie') {
      modalContent.innerHTML = `
        <h3>Competentie bewerken</h3>

        <label>Code</label>
        <input id="editCode" value="${data.code}">

        <label>Titel</label>
        <input id="editTitel" value="${data.titel}">

        <label>Omschrijving</label>
        <input id="editOmschrijving" value="${data.omschrijving}">

        <label>Gewicht</label>
        <input id="editGewicht" type="number" value="${data.gewicht}">

        <div class="modal-actions">
          <button class="btn-primary" id="saveEdit">Opslaan</button>
          <button class="btn-outline" id="closeModal">Annuleren</button>
        </div>
      `;
    }

    if (type === 'rubriek') {
      modalContent.innerHTML = `
        <h3>Rubriek bewerken</h3>

        <label>Titel</label>
        <input id="editTitel" value="${data.titel}">

        <label>Omschrijving</label>
        <input id="editOmschrijving" value="${data.omschrijving}">

        <label>Score</label>
        <input id="editScore" type="number" value="${data.score}">

        <div class="modal-actions">
          <button class="btn-primary" id="saveEdit">Opslaan</button>
          <button class="btn-outline" id="closeModal">Annuleren</button>
        </div>
      `;
    }

    modal.classList.add('active');

    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('saveEdit').onclick = handleSave;
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  function handleSave() {
    if (currentType === 'competentie') {
      const updated = {
        id: currentId,
        code: document.getElementById('editCode').value,
        titel: document.getElementById('editTitel').value,
        omschrijving: document.getElementById('editOmschrijving').value,
        gewicht: document.getElementById('editGewicht').value
      };
      console.log('SAVE COMPETENTIE', updated);
    }

    if (currentType === 'rubriek') {
      const updated = {
        id: currentId,
        titel: document.getElementById('editTitel').value,
        omschrijving: document.getElementById('editOmschrijving').value,
        score: document.getElementById('editScore').value
      };
      console.log('SAVE RUBRIEK', updated);
    }

    alert("Opgeslagen!");
    closeModal();
  }

  /* ✅ EVENTS */

  document.querySelectorAll('.edit-comp-btn').forEach(btn => {
    btn.onclick = () => {
      openModal('competentie', {
        id: btn.dataset.id,
        code: btn.dataset.code,
        titel: btn.dataset.titel,
        omschrijving: btn.dataset.omschrijving,
        gewicht: btn.dataset.gewicht
      });
    };
  });

  document.querySelectorAll('.edit-rubriek-btn').forEach(btn => {
    btn.onclick = () => {
      openModal('rubriek', {
        id: btn.dataset.id,
        titel: btn.dataset.titel,
        omschrijving: btn.dataset.omschrijving,
        score: btn.dataset.score
      });
    };
  });

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}