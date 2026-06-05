// mockdata voor als de server niet bereikbaar is.
// Wanneer de backend actief is, wordt deze data niet meer gebruikt.

export const aanvragenMockdata = [
  {
    id: 'mock-1',
    naam: 'Lisa Peeters',
    functie: 'DevOps Engineer',
    datum: '28/4/2026',
    status: 'in_afwachting',
    studentEmail: 'lisa.peeters@student.ehb.be',
    bedrijf: {
      naam: 'CloudTech NV',
      adres: 'Technologielaan 45, 9000 Gent',
      contactpersoon: 'Mark Janssen',
      email: 'mark@cloudtech.be',
      telefoon: '+32 9 234 56 78',
    },
    stagementor: {
      naam: 'Sophie De Smet',
      email: 'sophie.desmet@cloudtech.be',
      telefoon: '+32 9 234 56 79',
    },
    docent: { naam: 'Prof. Sarah Claes', email: 'sarah.claes@ehb.be' },
    stageDetails: {
      omschrijving: 'De stagiair zal helpen bij het opzetten van CI/CD pipelines, container orchestratie met Kubernetes, en infrastructure as code met Terraform.',
      start: '1/3/2026',
      einde: '30/6/2026',
      urenPerWeek: 40,
    },
    historiek: null,
  },
  {
    id: 'mock-2',
    naam: 'Tom Claes',
    functie: 'Mobile Developer',
    datum: '1/5/2026',
    status: 'in_afwachting',
    studentEmail: 'tom.claes@student.ehb.be',
    bedrijf: {
      naam: 'Mobile Apps Inc',
      adres: 'Antwerpsesteenweg 12, 2000 Antwerpen',
      contactpersoon: 'Jan De Backer',
      email: 'jan@mobileapps.be',
      telefoon: '+32 3 123 45 67',
    },
    stagementor: {
      naam: 'Lien Vermeersch',
      email: 'lien@mobileapps.be',
      telefoon: '+32 3 123 45 68',
    },
    docent: { naam: 'Prof. Koen Martens', email: 'koen.martens@ehb.be' },
    stageDetails: {
      omschrijving: 'Ontwikkeling van een cross-platform mobiele applicatie met React Native voor iOS en Android.',
      start: '1/3/2026',
      einde: '30/6/2026',
      urenPerWeek: 40,
    },
    historiek: null,
  },
  {
    id: 'mock-3',
    naam: 'Sara Janssen',
    functie: 'Frontend Developer',
    datum: '3/5/2026',
    status: 'goedgekeurd',
    studentEmail: 'sara.janssen@student.ehb.be',
    bedrijf: {
      naam: 'WebStudio BVBA',
      adres: 'Brusselsestraat 88, 3000 Leuven',
      contactpersoon: 'Peter Wouters',
      email: 'peter@webstudio.be',
      telefoon: '+32 16 987 65 43',
    },
    stagementor: {
      naam: 'Els Peeters',
      email: 'els@webstudio.be',
      telefoon: '+32 16 987 65 44',
    },
    docent: { naam: 'Prof. An Vermeulen', email: 'an.vermeulen@ehb.be' },
    stageDetails: {
      omschrijving: 'Bouwen van moderne webinterfaces met Vue.js en het optimaliseren van de gebruikerservaring voor bestaande klanten.',
      start: '1/3/2026',
      einde: '30/6/2026',
      urenPerWeek: 38,
    },
    historiek: {
      beslissing: 'goedgekeurd',
      feedback: 'Het stagevoorstel voldoet aan alle vereisten. De taakomschrijving is duidelijk en het bedrijf heeft aantoonbare ervaring met stagiairs.',
      datum: '10/5/2026',
      beoordeeldDoor: 'Prof. De Vries',
    },
  },
];
