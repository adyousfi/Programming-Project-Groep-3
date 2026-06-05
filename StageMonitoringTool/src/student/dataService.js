import mockData from '../data/mock-stagevoorstellen.json';

const STORAGE_KEY = 'stagevoorstellen_mock';

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export function loadMockProposals() {
  const proposals = mockData?.proposals || mockData.proposals || [];
  return Array.isArray(proposals) ? proposals : [];
}

export function getSavedProposals() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return parseJson(saved, []);
}

export function saveProposal(proposal) {
  const proposals = getSavedProposals();
  const next = [...proposals, proposal];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
  return proposal;
}

export function getLatestProposal() {
  const saved = getSavedProposals();
  if (saved.length > 0) {
    return saved[saved.length - 1];
  }
  const mock = loadMockProposals();
  return mock[mock.length - 1] || null;
}
