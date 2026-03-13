const STORAGE_KEY = 'thebridge_influencers'

export function getStoredInfluencers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveInfluencer(influencer) {
  const list = getStoredInfluencers()
  list.unshift(influencer)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (_) {}
}

export function generateId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
