# TODO - Evaluatie opslaan in database

## Stap 1: Backend
- [x] Nieuwe controllerfunctie toevoegen in `StageMonitoringTool/db/objectControllers/evaluatieController.js` om per competentie score+feedback op te slaan (update `Evaluatie.rubriek_id` en `Evaluatie.feedback_docent`).
- [x] Nieuwe route toevoegen in `StageMonitoringTool/db/routes/evaluatieRoutes.js` (PUT/POST) die door de frontend wordt aangeroepen.

## Stap 2: Frontend
- [x] In `StageMonitoringTool/src/docent/evaluatie.js` de mock `console.log` vervangen door een echte `fetch` naar de nieuwe backend route.


## Stap 3: Controleren
- [ ] Server herstarten.
- [ ] Vanuit UI evaluatie opslaan en check DB: `Evaluatie.rubriek_id` en `feedback_docent` moeten wijzigen.

