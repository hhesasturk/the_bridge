import { setCurrentUser } from './authStorage'
import { supabase, hasSupabase } from '../lib/supabase'

function userFromSession(session) {
  if (!session?.user) return null
  const u = session.user
  const username = u.user_metadata?.user_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || ''
  return {
    id: u.id,
    email: u.email || '',
    username: username.trim() || u.email?.split('@')[0] || 'Kullanici',
  }
}

export function initSupabaseAuth() {
  if (!hasSupabase || !supabase) return
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) setCurrentUser(userFromSession(session))
    else setCurrentUser(null)
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) setCurrentUser(userFromSession(session))
    else setCurrentUser(null)
  })
}
