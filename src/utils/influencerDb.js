import { supabase, hasSupabase } from '../lib/supabase'
import { getStoredInfluencers, saveInfluencer as saveLocal, deleteInfluencerByUserId as deleteLocalByUserId, generateId } from './influencerStorage'

function rowToInfluencer(row) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || '',
    fullName: row.full_name || row.username || '',
    avatar: row.avatar_url || '',
    instagramHandle: row.instagram_handle || '',
    followers: Number(row.followers) || 0,
    city: row.city || '',
    cities: Array.isArray(row.cities) ? row.cities : (row.cities ? [row.cities] : []),
    categories: Array.isArray(row.categories) ? row.categories : [],
    collaborationTypes: Array.isArray(row.collaboration_types) ? row.collaboration_types : [],
    bio: row.bio || '',
  }
}

export async function getAllInfluencers() {
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('influencers').select('*').order('created_at', { ascending: false })
    if (!error && data) return data.map(rowToInfluencer)
  }
  return getStoredInfluencers()
}

function buildRow(influencer) {
  return {
    user_id: influencer.userId,
    username: influencer.username || '',
    full_name: influencer.fullName || influencer.username || '',
    avatar_url: influencer.avatar && String(influencer.avatar).trim() ? influencer.avatar : null,
    instagram_handle: influencer.instagramHandle || null,
    followers: Number(influencer.followers) || 0,
    city: influencer.city || null,
    cities: influencer.cities || [],
    categories: influencer.categories || [],
    collaboration_types: influencer.collaborationTypes || [],
    bio: influencer.bio || null,
  }
}

export async function addInfluencer(influencer) {
  if (hasSupabase && supabase && influencer.userId) {
    const row = buildRow(influencer)
    const { data, error } = await supabase.from('influencers').insert(row).select('id').single()
    if (!error && data) return { ...influencer, id: data.id }
  }
  const withId = { ...influencer, id: influencer.id || generateId() }
  saveLocal(withId)
  return withId
}

/** Ayni user_id varsa gunceller; yoksa ekler (Keşfet'te tek kart, cift kayit onlenir) */
export async function upsertInfluencer(influencer) {
  const userId = influencer.userId
  if (hasSupabase && supabase && userId) {
    const existing = await getInfluencerByUserId(userId)
    const row = buildRow(influencer)
    if (existing?.id) {
      const { data, error } = await supabase.from('influencers').update(row).eq('id', existing.id).select('id').single()
      if (!error && data) return { ...influencer, id: data.id }
    } else {
      const { data, error } = await supabase.from('influencers').insert(row).select('id').single()
      if (!error && data) return { ...influencer, id: data.id }
    }
  }
  if (userId) deleteLocalByUserId(userId)
  const withId = { ...influencer, id: influencer.id || generateId() }
  saveLocal(withId)
  return withId
}

export async function getInfluencerByUserId(userId) {
  if (hasSupabase && supabase) {
    const { data } = await supabase.from('influencers').select('*').eq('user_id', userId).limit(1).maybeSingle()
    return data ? rowToInfluencer(data) : null
  }
  return getStoredInfluencers().find((i) => i.userId === userId) || null
}

export async function deleteInfluencerByUserId(userId) {
  if (hasSupabase && supabase) {
    await supabase.from('influencers').delete().eq('user_id', userId)
  }
  deleteLocalByUserId(userId)
}
