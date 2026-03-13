const USERS_KEY = 'thebridge_users'
const CURRENT_USER_KEY = 'thebridge_current_user'

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addUser({ email, username, password, id }) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return null
  const user = { id: id || 'u_' + Date.now(), email: email.trim().toLowerCase(), username: (username || '').trim(), password }
  users.push(user)
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return user
  } catch {
    return null
  }
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase())
}

export function validateLogin(email, password) {
  const user = findUserByEmail(email)
  if (!user || user.password !== password) return null
  return user
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  try {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(CURRENT_USER_KEY)
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth-change'))
  } catch (_) {}
}

export function removeUser(userId) {
  const users = getUsers().filter((u) => u.id !== userId)
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    setCurrentUser(null)
  } catch (_) {}
}

export function generateUserId() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
