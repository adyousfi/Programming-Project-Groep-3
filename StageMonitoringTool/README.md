# StageMonitoringTool (Stage Monitoring Tool)

## Lokale setup

### 1) Installeer dependencies (alle modules)
1) Install backend/frontend dependencies:
```bash
cd StageMonitoringTool
npm install



### 2) Configureer je database in `.env`
Zorg dat `StageMonitoringTool/.env` bevat (namen zoals gebruikt in `db/dbConnection.js`):
- `DB` (databasenaam)
- `USER`
- `PASSWORD`

> Als je deze vars niet instelt, faalt de app bij het verbinden.

### 2.1) Verbind met juiste database (lokale MySQL of Azure/cloud)
- In `db/dbConnection.js` staat momenteel: `host: 'localhost'`.
- Voor **lokale MySQL** is dit meestal correct.
- Voor **Azure/cloud** moet je `host` aanpassen naar de hostnaam/IP van je cloud database.
  - Mogelijk ook poort/SSL parameters indien je databank dat vereist.


```bash
npm run startdb
```


## Applicatie runnen
In een aparte terminal:
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
### Frontend en Backend (Vite)
In een aparte terminal:
```bash
npm run start

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

