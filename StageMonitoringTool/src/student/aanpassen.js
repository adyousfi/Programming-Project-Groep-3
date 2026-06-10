import './aanpassen.css';

export async function renderAanpassen(container, userName = '[Studentnaam]') {
    container.innerHTML = `<div class="aanpassen-modal-overlay"><div class="aanpassen-modal">
        <p>De aanpassen-functionaliteit wordt momenteel herschreven naar het database-systeem.</p>
        <button onclick="window.location.href='/?role=student'">Terug naar dashboard</button>
    </div></div>`;
}
