import mockData from '../data/stagevoorstellen.json';

const STORAGE_KEY = 'stagevoorstellen_mock';

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function getSavedProposalsFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return parseJson(saved, []);
}

export function loadMockProposals() {
  const proposals = mockData?.proposals || [];
  return Array.isArray(proposals) ? proposals : [];
}

export async function getSavedProposals() {
  try {
    const response = await fetch('/api/proposals');
    if (response.ok) {
      const proposals = await response.json();
      return Array.isArray(proposals) ? proposals : [];
    }
  } catch (error) {
    // ignore and fallback to localStorage
  }
  return getSavedProposalsFromStorage();
}

export async function saveProposal(proposal) {
  try {
    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proposal),
    });

    if (response.ok) {
      return { proposal: await response.json(), source: 'server' };
    }
  } catch (error) {
    // ignore and fallback to localStorage
  }

  const proposals = getSavedProposalsFromStorage();
  const next = [...proposals, proposal];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
  return { proposal, source: 'local' };
}

export async function getLatestProposal() {
  const saved = await getSavedProposals();
  if (saved.length > 0) {
    return saved[saved.length - 1];
  }
  const mock = loadMockProposals();
  return mock[mock.length - 1] || null;
}
