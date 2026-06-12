# StageMonitoringTool (Stage Monitoring Tool)

## Lokale setup
### 1) Installeer dependencies
```bash
cd StageMonitoringTool
npm install
```

### 2) Configureer je database in `.env`
Zorg dat `StageMonitoringTool/.env` bevat (namen zoals gebruikt in `db/dbConnection.js`):
- `DB` (databasenaam)
- `USER`
- `PASSWORD`

> Als je deze vars niet instelt, faalt de app bij het verbinden.

## Database tabellen aanmaken (en seeden)
Deze opdracht reset de database tabellen en vult dummy data in.

```bash
npm run startdb
```

Wat gebeurt er intern?
- `db/maindb.js` roept `run()` aan (connect + `sequelize.sync()`)
- `db/seedDb.js` doet vervolgens `sequelize.sync({ force: true })` en seedt daarna users/stages.

## Applicatie runnen
### Frontend (Vite)
In een aparte terminal:
```bash
npm run dev
```

### Backend (Express)
Backend endpoints worden gestart via:
```bash
npm run testServer
```

## Korte flow / overzicht van de applicatie
1. **Login**
   - Endpoint: `POST /login`
   - Cookie: `user`
2. **Stages bekijken**
   - Endpoint: `GET /api/stages`
   - Endpoint: `GET /api/stages/goedgekeurd`
3. **Stage aanmaken (student flow)**
   - Endpoint: `POST /api/stages`
4. **Stage bijwerken (admin/stagecommissie flow)**
   - Endpoint: `PUT /api/stages/:id`
5. **Documenten uploaden**
   - Admin upload: `POST /api/documents/admin-upload`
   - Student upload: `POST /api/documents/student-upload`
6. **Documenten bekijken en downloaden**
   - `GET /api/documents/mijn`
   - `GET /api/documents/stage/:stageId`
   - Download: `GET /api/documents/:id/download`

## Belangrijk bij development
- Als je wijzigingen in modellen maakt: herrun altijd eerst:
  - `npm run startdb`

