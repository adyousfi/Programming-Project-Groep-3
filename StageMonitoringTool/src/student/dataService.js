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
  const result = parseJson(saved, []);
  return Array.isArray(result) ? result : [];
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
    } else {
      console.warn('Server returned non-ok response:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('Fetch error, falling back to localStorage:', error);
  }

  try {
    const proposals = getSavedProposalsFromStorage();
    const next = [...proposals, proposal];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
    return { proposal, source: 'local' };
  } catch (storageError) {
    console.error('localStorage error:', storageError);
    throw new Error('Kon voorstel niet opslaan: ' + storageError.message);
  }
}

export async function getLatestProposal() {
  const saved = await getSavedProposals();
  if (saved.length > 0) {
    return saved[saved.length - 1];
  }
  const mock = loadMockProposals();
  return mock[mock.length - 1] || null;
}

const ACTIVE_PROPOSAL_KEY = 'activeProposalId';

export function setActiveProposalId(id) {
  localStorage.setItem(ACTIVE_PROPOSAL_KEY, id);
}

export function getActiveProposalId() {
  return localStorage.getItem(ACTIVE_PROPOSAL_KEY);
}

export async function getProposalById(id) {
  const proposals = await getSavedProposals();
  return proposals.find(p => p.id === id) || null;
}

export async function updateProposal(id, updates) {
  try {
    const response = await fetch(`/api/proposals/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (response.ok) {
      return { proposal: await response.json(), source: 'server' };
    }
  } catch (error) {
    console.warn('PUT failed, falling back to localStorage:', error);
  }

  const proposals = getSavedProposalsFromStorage();
  const index = proposals.findIndex(p => p.id === id);
  if (index !== -1) {
    proposals[index] = { ...proposals[index], ...updates, id, laatstBewerktOp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals, null, 2));
    return { proposal: proposals[index], source: 'local' };
  }
  throw new Error(`Voorstel met id '${id}' niet gevonden.`);
}
