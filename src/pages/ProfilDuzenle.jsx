import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOCIAL_PLATFORMS } from '../config/constants'
import { getCurrentUser, setCurrentUser } from '../utils/authStorage'
import { supabase, hasSupabase } from '../lib/supabase'
import styles from '../styles/ProfilDuzenle.module.css'

export default function ProfilDuzenle() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState({})
  const [socialUsernames, setSocialUsernames] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (!u) {
      navigate('/giris')
      return
    }
    setUsername(u.username || '')
    const handles = u.socialHandles || {}
    const nextSelected = {}
    const nextUsernames = {}
    SOCIAL_PLATFORMS.forEach(({ id }) => {
      if (handles[id] != null && handles[id] !== '') {
        nextSelected[id] = true
        nextUsernames[id] = handles[id]
      }
    })
    setSelectedPlatforms(nextSelected)
    setSocialUsernames(nextUsernames)
  }, [navigate])

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) {
        setSocialUsernames((s) => {
          const s2 = { ...s }
          delete s2[id]
          return s2
        })
      }
      return next
    })
  }

  const setSocialUsername = (id, value) => {
    setSocialUsernames((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setSaving(true)
    const name = username.trim() || user.username || 'Kullanici'
    const handles = Object.keys(selectedPlatforms)
      .filter((id) => selectedPlatforms[id])
      .reduce((acc, id) => {
        acc[id] = (socialUsernames[id] || '').trim()
        return acc
      }, {})

    try {
      if (hasSupabase && supabase) {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const existing = authUser.user_metadata || {}
          await supabase.auth.updateUser({
            data: {
              ...existing,
              user_name: name,
              social_handles: handles,
            },
          })
        }
      }
      setCurrentUser({ ...user, username: name, socialHandles: handles })
      setSaved(true)
      setTimeout(() => navigate('/profilim'), 1200)
    } catch (err) {
      setError(err.message || 'Kaydedilirken hata olustu.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  if (saved) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.card}>
            <h2 className={styles.successTitle}>Profil guncellendi</h2>
            <p className={styles.successText}>Profilim sayfasina yonlendiriliyorsunuz...</p>
            <Link to="/profilim" className={styles.successLink}>Profilime git</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>Profilimi duzenle</h1>
          <p className={styles.subtitle}>
            Kullanici adinizi ve sosyal medya hesaplarinizi girin. E-posta ve sifre degistirilmez.
          </p>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Kullanici adi</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullanici_adi"
            />
            <div className={styles.socialSection}>
              <h3 className={styles.socialTitle}>Sosyal medya hesaplari</h3>
              <p className={styles.socialHint}>Istediklerinizi secin, kullanici adini yazin.</p>
              {SOCIAL_PLATFORMS.map(({ id, label }) => (
                <div key={id} className={styles.socialRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={!!selectedPlatforms[id]}
                      onChange={() => togglePlatform(id)}
                    />
                    <span>{label}</span>
                  </label>
                  {selectedPlatforms[id] && (
                    <input
                      type="text"
                      className={styles.socialInput}
                      value={socialUsernames[id] || ''}
                      onChange={(e) => setSocialUsername(id, e.target.value)}
                      placeholder={id === 'instagram' ? '@kullanici_adi' : 'Kullanici adi'}
                    />
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
          <p className={styles.back}>
            <Link to="/profilim">Profilime don</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
