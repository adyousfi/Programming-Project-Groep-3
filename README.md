# 📊 Stage Monitoring Tool

## 📖 Inleiding
De Stage Monitoring Tool is een webapplicatie die ontwikkeld is om het stageproces van studenten te vereenvoudigen en te centraliseren. Met deze tool kunnen studenten hun voortgang bijhouden, terwijl stagebegeleiders en bedrijven deze eenvoudig kunnen opvolgen en evalueren. De applicatie is gericht op studenten, stagebegeleiders en bedrijven.

## ⚙️ Installatie (lokaal draaien)

Clone eerst de repository met:

```bash
git clone https://github.com/adyousfi/Programming-Project-Groep-3.git
cd Programming-Project-Groep-3/StageMonitoringTool
```

Installeer daarna alle dependencies met:

```bash
cd .\StageMonitoringTool
npm install
```

Maak vervolgens een `.env` bestand aan in de root van het project en configureer je database:

```env
DB=
USER=
PASSWORD=

# Verander deze waarden voor de beveiliging van het inlogproces — hoe complexer, hoe beter
JWT_SECRET=
```

Start tenslotte de applicatie met:

```bash
npm run start
```

## 🗄️ Database

De applicatie werkt met een lokale database die op je eigen computer draait. Dit maakt het eenvoudig om te testen en te ontwikkelen zonder internetverbinding. Zorg ervoor dat je database actief is en dat de instellingen in je `.env` bestand correct zijn.

## 🔄 Ontstaan van het project

We zijn aan dit project begonnen voor een schoolopdracht aan de Erasmushogeschool Brussel, in de richting Toegepaste Informatica, voor het vak Programming Project. We hebben eerst de basisprincipes van programmeren geleerd en daarna een prototype gemaakt. Op basis van dat prototype zijn we vervolgens met de effectieve ontwikkeling gestart.

## 🔁 Algemene flow

- Een student dient een stagevoorstel in.
- Het stagecomité kan deze aanvraag accepteren, afwijzen of aanpassingen vragen.
- Wanneer goedgekeurd, uploadt een admin een stageovereenkomst naar de student en het bedrijf.
- Het bedrijf en de student ondertekenen de stageovereenkomst in de applicatie.
- De admin valideert het antwoord.
- De student kan zijn logboek dagelijks invullen.
- De docent, stagementor en student kunnen het logboek bekijken.
- De docent plant een tussentijdse of finale evaluatie.
- De student en mentor beoordelen de student.
- De docent geeft de finale score.
- De stage eindigt.

## 🛠️ Technologieën

Het project is gebouwd met JavaScript en Node.js, samen met verschillende packages en een database zoals MySQL of MongoDB.

## 👥 Team

- Adam Yousfi
- Imane Azehaf
- Jon Hysenaj
- Len Jochmans
- Mohamed Ayadi


## 🔗 Bronnenmelding

Alle chatlogs en bronnen die zijn gebruikt bij de ontwikkeling van dit project(Chatlogs van AYADI Mohamed):

### OpenCode chatlogs
- **OpenCode chatlogs** — 80 sessies (5 juni – 22 juni 2026): [`StageMonitoringTool/docs/mohamed_chatlogs/opencode_chatlogs.txt`](StageMonitoringTool/docs/mohamed_chatlogs/opencode_chatlogs.txt)

> **Opmerking:** Naast de bovenstaande 80 sessies zijn er ~87 bijkomende subagent-sessies (achtergrondtaken van OpenCode zoals "Explore codebase structure") die automatisch werden aangemaakt als kind-processen van de bovenstaande sessies. Deze bevatten alleen interne onderzoekstaken (bestanden lezen, code analyseren) en geen aparte gesprekken. Ik heb bewust besloten om deze niet op te nemen in de bronnenlijst, maar ze zijn wel beschikbaar indien gewenst.

> **Opmerking:** Enkele OpenCode chatlogs zijn verwijderd voordat ik wist dat bronnenmelding van de chatlogs vereist was. Mocht dit gebeurd zijn, dan betreur ik dat en kunnen deze niet meer gereferent worden. De bovenstaande lijst bevat alle chatlogs die nog beschikbaar zijn en die gebruikt zijn voor dit project. Hopelijk ben ik geen enkel chatlog vergeten en mijn excuses daarvoor.
> — Mohamed

### GitHub Copilot chatlogs
- **Transcript 1** — Wachten pagina bouwen + uitloggen button fix: [`github_copilot_chatlog1_transcript.txt`](StageMonitoringTool/docs/mohamed_chatlogs/github_copilot_chatlog1_transcript.txt) (JSON-bestand ook beschikbaar: `github_copilot_chatlog1.json`)
- **Transcript 2** — Indienen button fout "Er is een fout opgetreden" debuggen: [`github_copilot_chatlog2_transcript.txt`](StageMonitoringTool/docs/mohamed_chatlogs/github_copilot_chatlog2_transcript.txt) (JSON-bestand ook beschikbaar: `github_copilot_chatlog2.json`)
- **Transcript 3** — Indienen redirect naar wachten pagina werkt niet voor specifieke user: [`github_copilot_chatlog3_transcript.txt`](StageMonitoringTool/docs/mohamed_chatlogs/github_copilot_chatlog3_transcript.txt) (JSON-bestand ook beschikbaar: `github_copilot_chatlog3.json`)
- **Transcript 4** — Nieuwe pagina voor "aanpassingen vereist" status maken: [`github_copilot_chatlog4_transcript.txt`](StageMonitoringTool/docs/mohamed_chatlogs/github_copilot_chatlog4_transcript.txt) (JSON-bestand ook beschikbaar: `github_copilot_chatlog4.json`)
- **Transcript 5** — Admin kan document niet zien na student sendback (document geupload status): [`github_copilot_chatlog5_transcript.txt`](StageMonitoringTool/docs/mohamed_chatlogs/github_copilot_chatlog5_transcript.txt) (JSON-bestand ook beschikbaar: `github_copilot_chatlog5.json`)

### Antigravity chatlog
- **Antigravity chatlog** — Student pagina bouwen (js/css, stap voor stap): [`antigravity_chatlog.md`](StageMonitoringTool/docs/mohamed_chatlogs/antigravity_chatlog.md)


---


## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden — Erasmushogeschool Brussel.

