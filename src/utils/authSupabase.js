import { setCurrentUser } from './authStorage'
import { supabase, hasSupabase } from '../lib/supabase'

function userFromSession(session) {
  if (!session?.user) return null
  const u = session.user
  const username = u.user_metadata?.user_name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || ''
  const socialHandles = u.user_metadata?.social_handles && typeof u.user_metadata.social_handles === 'object'
    ? u.user_metadata.social_handles
    : {}
  return {
    id: u.id,
    email: u.email || '',
    username: username.trim() || u.email?.split('@')[0] || 'Kullanici',
    socialHandles,
  }
}

export function initSupabaseAuth() {
  if (!hasSupabase || !supabase) return
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) setCurrentUser(userFromSession(session))
    else setCurrentUser(null)
    // Google OAuth sonrasi ana sayfaya donulduysa /profilim'e yonlendir
    if (session?.user && typeof window !== 'undefined' && window.location.pathname === '/' && window.location.hash) {
      window.location.replace(window.location.origin + '/profilim')
    }
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) setCurrentUser(userFromSession(session))
    else setCurrentUser(null)
  })
}
