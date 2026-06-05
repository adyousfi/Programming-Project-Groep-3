import { aanvragenMockdata } from '../data/mockdata.js';

// zorgt dat stagevoorstel (student formaat uit stagevoorstellen.json) naar een aanvraag (stagecommissie formaat) wordt verstuurd
function mapProposalToAanvraag(proposal) {
  const datum = proposal.ingediendOp
    ? new Date(proposal.ingediendOp).toLocaleDateString('nl-BE')
    : '';

  const statusMap = { wachten: 'in_afwachting' };

  return {
    id: proposal.id,
    naam: proposal.studentNaam || '',
    functie: proposal.functie || '',
    datum,
    status: statusMap[proposal.status] || proposal.status || 'in_afwachting',
    studentEmail: proposal.studentEmail || '',
    bedrijf: {
      naam: proposal.bedrijfNaam || '',
      adres: proposal.bedrijfAdres || '',
      contactpersoon: proposal.bedrijfContactpersoon || '',
      email: proposal.bedrijfEmail || '',
      telefoon: proposal.bedrijfTelefoon || '',
    },
    stagementor: {
      naam: proposal.mentorNaam || '',
      email: proposal.mentorEmail || '',
      telefoon: proposal.mentorTelefoon || '',
    },
    docent: {
      naam: proposal.docentNaam || '',
      email: proposal.docentEmail || '',
    },
    stageDetails: {
      omschrijving: proposal.opdrachtOmschrijving || '',
      start: proposal.periodeStart || '',
      einde: proposal.periodeEind || '',
      urenPerWeek: proposal.urenPerWeek || '',
    },
    historiek: proposal.historiek || null,
  };
}

// Wanneer de backend klaar is, blijft deze functie hetzelfde, alleen de URL verandert.
export async function getAllAanvragen() {
  try {
    const response = await fetch('/api/proposals');
    if (response.ok) {
      const proposals = await response.json();
      if (Array.isArray(proposals) && proposals.length > 0) {
        return proposals.map(mapProposalToAanvraag);
      }
    }
  } catch (e) {
    console.warn('Server niet bereikbaar, mockdata wordt gebruikt.');
  }
  return aanvragenMockdata;
}
