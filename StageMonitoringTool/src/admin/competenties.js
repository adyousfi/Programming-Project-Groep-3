import './competenties.css';
import { renderAdmin } from './admin.js';
import { renderKoppelingen } from './koppeldocent.js';
import { renderAdminDocumenten } from './adminDocumenten.js';

const API_URL = '/api';

function mapCompetentie(dbRow) {
  return {
    id: dbRow.competentie_id,
    code: dbRow.code,
    titel: dbRow.titel,
    omschrijving: dbRow.omschrijving,
    gewicht: dbRow.gewicht,
  };
}

function mapRubriek(dbRow) {
  return {
    id: dbRow.rubriek_id,
    // rubriektitel/rubriek_beschrijving bestaan niet in model; beschrijving is wat we opslaan
    titel: dbRow.beschrijving,
    omschrijving: dbRow.beschrijving,
    score: dbRow.score,
  };
}

async function getCompetenties() {
  const res = await fetch(`${API_URL}/competenties/all`);
  const json = await res.json();
  return (json.data || []).map(mapCompetentie);
}

async function getRubriekenByCompetentieId(competentieId) {
  const res = await fetch(`${API_URL}/rubrieken/by-competentie/${competentieId}`);
  const json = await res.json();
  return (json.data || []).map(mapRubriek);
}

/* ✅ MAIN */
export async function renderCompetenties(app) {
  app.innerHTML = `<p>Laden...</p>`;
  const competenties = await getCompetenties();

  let html = `
    <div class="admin-layout">

      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Administratie</h1>
          <p class="sidebar-subtitle">Erasmushogeschool Brussel</p>
        </div>

        <nav class="sidebar-nav">
          <a href="#" id="navGebruikers" class="nav-item">Gebruikers</a>
          <a href="#" id="navKoppelingen" class="nav-item">Koppelingen</a>
          <a href="#" id="navDocumenten" class="nav-item">Documenten</a>
          <a href="#" id="navCompetenties" class="nav-item active">Competenties</a>
        </nav>

        <div class="sidebar-footer">
          <p class="user-name">Admin User</p>
          <button class="logout-link" id="co-logout">Uitloggen</button>
        </div>
      </aside>

      <main class="main-content">

        <header class="page-header">
          <h1 class="page-title">Competenties beheren</h1>
          <button class="btn-primary" id="addCompetentieBtn">+ Competentie toevoegen</button>
        </header>
  `;

  for (const comp of competenties) {

    const rubrieken = await getRubriekenByCompetentieId(comp.id);

    html += `
      <div class="card">

        <div class="competentie-header">
          <h3 class="competentie-titel">${comp.code} - ${comp.titel}</h3>

          <div class="competentie-row">
            <div class="competentie-info">
              <p class="competentie-omschrijving">${comp.omschrijving}</p>
              <p class="competentie-gewicht">Gewicht: ${comp.gewicht}</p>
            </div>

            <div style="display:flex;gap:8px;">
              <button class="btn-outline edit-comp-btn"
                data-id="${comp.id}"
                data-code="${comp.code}"
                data-titel="${comp.titel}"
                data-omschrijving="${comp.omschrijving}"
                data-gewicht="${comp.gewicht}">
                Bewerken
              </button>
              <button class="btn-danger delete-comp-btn"
                data-id="${comp.id}">
                Verwijderen
              </button>
            </div>
          </div>
        </div>

        <table class="rubriektabel">
          <thead>
            <tr>
              <th>Rubriek titel</th>
              <th>Score</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            ${rubrieken.map(r => `
              <tr>
                <td>${r.titel}</td>
                <td>${r.score}</td>
                <td>
                  <button class="btn-outline edit-rubriek-btn"
                    data-id="${r.id}"
                    data-titel="${r.titel}"
                    data-omschrijving="${r.omschrijving}"
                    data-score="${r.score}">
                    Bewerken
                  </button>
                </td>
              </tr>
            `).join('')}
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

    <!-- ✅ ADD MODAL -->
    <div id="addCompetentieModal" class="modal-overlay">
      <div class="modal" id="addCompetentieContent"></div>
    </div>
  `;

  app.innerHTML = html;

  /* ✅ NAVIGATIE */
  document.getElementById('navGebruikers').addEventListener('click', (e) => { e.preventDefault(); renderAdmin(app); });
  document.getElementById('navKoppelingen').addEventListener('click', (e) => { e.preventDefault(); renderKoppelingen(app); });
  document.getElementById('navDocumenten').addEventListener('click', (e) => { e.preventDefault(); renderAdminDocumenten(app); });

  /* ✅ UITLOGGEN */
  document.getElementById('co-logout').addEventListener('click', async () => {
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  });

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
        <input id="editGewicht" type="number" value="${data.gewicht}" step="1">

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

  async function handleSave() {
    try {
      if (currentType === 'competentie') {
        const payload = {
          code: document.getElementById('editCode').value,
          title: document.getElementById('editTitel').value,
          omschrijving: document.getElementById('editOmschrijving').value,
          gewicht: Number(document.getElementById('editGewicht').value),
        };

        const res = await fetch(`${API_URL}/competenties/update-competentie/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.msg || 'Fout bij opslaan competentie');
      }

      if (currentType === 'rubriek') {
        const payload = {
          score: Number(document.getElementById('editScore').value),
          beschrijving: document.getElementById('editOmschrijving').value,
        };

        const res = await fetch(`${API_URL}/rubrieken/update-rubriek/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.msg || 'Fout bij opslaan rubriek');
      }

      alert('Opgeslagen!');
      closeModal();
      // Re-render to show updated data
      await renderCompetenties(app);
    } catch (e) {
      console.error(e);
      alert(e?.message || 'Opslaan mislukt');
    }
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

  /* ✅ DELETE COMPETENTIE */
  document.querySelectorAll('.delete-comp-btn').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Weet je zeker dat je deze competentie wilt verwijderen?\nAlle bijhorende rubrieken en scores worden ook verwijderd.')) return;
      try {
        const res = await fetch(`${API_URL}/competenties/delete-competentie/${btn.dataset.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.msg || 'Verwijderen mislukt');
        alert('Competentie verwijderd!');
        await renderCompetenties(app);
      } catch (e) {
        console.error(e);
        alert(e?.message || 'Verwijderen mislukt');
      }
    };
  });

  /* ✅ ADD COMPETENTIE */
  const addModal = document.getElementById('addCompetentieModal');
  const addContent = document.getElementById('addCompetentieContent');

  function openAddModal() {
    addContent.innerHTML = `
      <h3>Competentie toevoegen</h3>

      <label>Code</label>
      <input id="addCode" />

      <label>Titel</label>
      <input id="addTitel" />

      <label>Omschrijving</label>
      <input id="addOmschrijving" />

      <label>Gewicht</label>
      <input id="addGewicht" type="number" step="1" />

      <div class="modal-actions">
        <button class="btn-primary" id="addSave">Aanmaken</button>
        <button class="btn-outline" id="addClose">Annuleren</button>
      </div>
    `;
    addModal.classList.add('active');

    document.getElementById('addClose').onclick = () => {
      addModal.classList.remove('active');
    };

    document.getElementById('addSave').onclick = async () => {
      try {
        const payload = {
          code: document.getElementById('addCode').value,
          title: document.getElementById('addTitel').value,
          omschrijving: document.getElementById('addOmschrijving').value,
          gewicht: Number(document.getElementById('addGewicht').value),
          // 4 rubrieken met standaard teksten/score worden aan backend overgelaten
        };

        const res = await fetch(`${API_URL}/competenties/create-competentie-met-rubrieken`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json?.msg || 'Fout bij aanmaken competentie');

        alert('Competentie aangemaakt!');
        addModal.classList.remove('active');
        await renderCompetenties(app);
      } catch (e) {
        console.error(e);
        alert(e?.message || 'Aanmaken mislukt');
      }
    };
  }

  document.getElementById('addCompetentieBtn').onclick = openAddModal;

  addModal.onclick = (e) => {
    if (e.target === addModal) addModal.classList.remove('active');
  };
}