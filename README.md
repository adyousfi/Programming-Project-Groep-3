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

## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden — Erasmushogeschool Brussel.
