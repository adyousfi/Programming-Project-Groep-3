  import './beoordelen.css';

export function renderBeoordelen(aanvraag) {
  document.querySelector('#app').innerHTML = `
    <div class="bd-page">
      <header class="bd-header">
        <h1 class="bd-header-title">Stage Monitoring Tool</h1>
        <div class="bd-header-right">
          <div class="bd-header-user">
            <span class="bd-header-naam">Prof. De Vries</span>
            <span class="bd-header-rol">Stagecommissie</span>
          </div>
          <button class="bd-header-btn">Uitloggen</button>
        </div>
      </header>
      <div class="bd-content">
        <a href="#" class="bd-terug" id="bd-terug">← Terug naar dashboard</a>
        <h2 class="bd-titel">Stage Aanvraag Details</h2>
      </div>
    </div>
  `;

  document.querySelector('#bd-terug').addEventListener('click', function(e) {
    e.preventDefault();
    import('./aanvragen.js').then(function(m) { m.renderAanvragen(); });
  });
}
