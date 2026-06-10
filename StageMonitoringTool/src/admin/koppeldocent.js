import './koppeldocent.css';
import { renderAdmin } from './admin.js';

export function renderKoppelingen(app) {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex">

      <!-- Sidebar -->
      <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div class="border-b border-gray-200 px-6 py-4">
          <h1 class="text-lg">Administratie</h1>
          <p class="text-xs text-gray-600">Erasmushogeschool Brussel</p>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2">
          <button id="navGebruikers" class="w-full text-left px-4 py-2 rounded hover:bg-gray-100">
            Gebruikers
          </button>

          <button class="w-full text-left px-4 py-2 rounded bg-blue-100 text-blue-700">
            Koppelingen
          </button>

          <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100">
            Documenten
          </button>

          <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100">
            Competenties
          </button>
        </nav>

        <div class="border-t border-gray-200 px-6 py-4">
          <p class="text-sm mb-1">Admin User</p>
          <button class="text-sm text-blue-600 hover:underline">Uitloggen</button>
        </div>
      </div>

      <!-- Main -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-6xl">

          <h2 class="text-2xl mb-6">Docent Koppelingen</h2>

          <!-- Unassigned -->
          <div class="mb-6">
            <h3 class="text-lg mb-3 text-orange-700">
              Studenten zonder docent (1)
            </h3>

            <div class="bg-white rounded-lg shadow overflow-x-auto">
              <table class="w-full">
                <thead class="bg-orange-50 border-b border-orange-200">
                  <tr>
                    <th class="text-left p-4 text-sm">Studentnaam</th>
                    <th class="text-left p-4 text-sm">Bedrijf</th>
                    <th class="text-left p-4 text-sm">Periode</th>
                    <th class="text-left p-4 text-sm">Status</th>
                    <th class="text-left p-4 text-sm">Acties</th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="border-b border-gray-100 bg-orange-50">
                    <td class="p-4">Emma Willems</td>
                    <td class="p-4 text-sm">DataSoft Solutions</td>
                    <td class="p-4 text-sm">3 mrt - 30 jun 2026</td>
                    <td class="p-4">
                      <span class="px-3 py-1 rounded-full text-xs bg-orange-200 text-orange-800">
                        Geen docent toegewezen
                      </span>
                    </td>
                    <td class="p-4">
                      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm assign-btn">
                        Docent toewijzen
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Assigned -->
          <div>
            <h3 class="text-lg mb-3">
              Gekoppelde studenten (1)
            </h3>

            <div class="bg-white rounded-lg shadow overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="text-left p-4 text-sm">Studentnaam</th>
                    <th class="text-left p-4 text-sm">Bedrijf</th>
                    <th class="text-left p-4 text-sm">Periode</th>
                    <th class="text-left p-4 text-sm">Toegewezen docent</th>
                    <th class="text-left p-4 text-sm">Status</th>
                    <th class="text-left p-4 text-sm">Acties</th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="border-b border-gray-100">
                    <td class="p-4">Jan Janssens</td>
                    <td class="p-4 text-sm">TechCorp Belgium</td>
                    <td class="p-4 text-sm">3 feb - 30 mei 2026</td>
                    <td class="p-4 text-sm">Sarah Claes</td>
                    <td class="p-4">
                      <span class="px-3 py-1 rounded-full text-xs bg-green-200 text-green-800">
                        Actief
                      </span>
                    </td>
                    <td class="p-4">
                      <button class="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 change-btn">
                        Wijzigen
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  // 🔗 NAVIGATIE TERUG
  document.getElementById('navGebruikers').addEventListener('click', (e) => {
    e.preventDefault();
    renderAdmin(app);
  });

  // (optioneel events later uitbreiden)
}
