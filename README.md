# 📊 Stage Monitoring Tool

## 📖 Inleiding
De Stage Monitoring Tool is een webapplicatie die ontwikkeld is om het stageproces van studenten te vereenvoudigen en te centraliseren. Met deze tool kunnen studenten hun voortgang bijhouden, terwijl stagebegeleiders en bedrijven deze eenvoudig kunnen opvolgen en evalueren. De applicatie is gericht op studenten, stagebegeleiders en bedrijven.

## ⚙️ Installatie (lokaal draaien)
Clone eerst de repository met:
```bash
git clone https://github.com/adyousfi/Programming-Project-Groep-3.git
cd Programming-Project-Groep-3/StageMonitoringTool
````

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
```

Start tenslotte de applicatie met:

```bash
npm run start
```



## 🗄️ Database

De applicatie werkt met een lokale database die op je eigen computer draait. Dit maakt het eenvoudig om te testen en te ontwikkelen zonder internetverbinding. Zorg ervoor dat je database actief is en dat de instellingen in je `.env` bestand correct zijn.

## 🔄 Rollen en werking

Binnen de applicatie zijn er drie hoofdrollen. De student logt in, maakt een stage aan, voegt gegevens toe zoals bedrijf en taken, houdt zijn voortgang bij, uploadt documenten en communiceert met begeleiders. De stagebegeleider bekijkt studenten en hun stages, volgt hun voortgang, geeft feedback en voert evaluaties uit. De bedrijfsmentor volgt de student op de werkvloer, bevestigt activiteiten en geeft feedback of evaluaties.

## 🔁 Algemene flow

Het proces verloopt als volgt: de student registreert zijn stage en voegt regelmatig updates toe, de begeleider controleert deze informatie en geeft feedback, het bedrijf kan bijkomende feedback geven en uiteindelijk maakt de begeleider een eindbeoordeling.

## 🚀 Features

De tool bevat functionaliteiten zoals stagebeheer, voortgangsregistratie, een feedbacksysteem, evaluaties en communicatie tussen verschillende rollen.

## 🛠️ Technologieën

Het project is gebouwd met JavaScript, Node.js en een database zoals MySQL of MongoDB.

## 👥 Team

Adam YousfiI
Imane Azehaf
Jon Hysenaj
Len Jochmans
Mohamed Ayadi
## 📄 Licentie

Dit project is ontwikkeld voor educatieve doeleinden.

