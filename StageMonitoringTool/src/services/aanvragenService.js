import { aanvragenMockdata } from '../data/mockdata.js';

export async function getAllAanvragen() {
  try {
    const response = await fetch('/api/stages', { credentials: 'include' });
    if (response.ok) {
      const stages = await response.json();
      if (Array.isArray(stages) && stages.length > 0) {
        return stages;
      }
    }
  } catch (e) {
    console.warn('Server niet bereikbaar, mockdata wordt gebruikt.');
  }
  return aanvragenMockdata;
}
