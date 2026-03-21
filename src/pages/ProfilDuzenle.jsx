import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  SOCIAL_PLATFORMS,
  CONTENT_CATEGORIES,
  COLLABORATION_TYPES,
  CITIES,
  CITY_FILTER_ALL,
} from '../config/constants'
import { getCurrentUser, setCurrentUser } from '../utils/authStorage'
import { supabase, hasSupabase } from '../lib/supabase'
import { getInfluencerByUserId, upsertInfluencer } from '../utils/influencerDb'
import styles from '../styles/ProfilDuzenle.module.css'
import cpStyles from '../styles/CreateProfile.module.css'

export default function ProfilDuzenle() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [influencer, setInfluencer] = useState(null)
  const [loading, setLoading] = useState(true)

  const [username, setUsername] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState({})
  const [socialUsernames, setSocialUsernames] = useState({})

  const [instagramHandle, setInstagramHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [avatarUpload, setAvatarUpload] = useState(null)
  const [cities, setCities] = useState([CITY_FILTER_ALL])
  const [cityInput, setCityInput] = useState('')
  const [categories, setCategories] = useState([])
  const [customCategory, setCustomCategory] = useState('')
  const [collaborationTypes, setCollaborationTypes] = useState([])
  const [bio, setBio] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    const u = getCurrentUser()
    if (!u) {
      navigate('/giris')
      return
    }
    setUser(u)
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

    getInfluencerByUserId(u.id).then((inf) => {
      if (cancelled) return
      if (!inf) {
        navigate('/profil-olustur', { replace: true })
        return
      }
      setInfluencer(inf)
      setInstagramHandle(inf.instagramHandle || '')
      setFollowers(inf.followers != null ? String(inf.followers) : '')
      setProfilePhotoUrl(inf.avatar && String(inf.avatar).trim() ? inf.avatar : '')
      setAvatarUpload(null)
      setCities(
        inf.cities?.length
          ? [...inf.cities]
          : inf.city
            ? [inf.city]
            : [CITY_FILTER_ALL]
      )
      setCategories(inf.categories?.length ? [...inf.categories] : [])
      setCollaborationTypes(inf.collaborationTypes?.length ? [...inf.collaborationTypes] : [])
      setBio(inf.bio || '')
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
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

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const addCustomCategory = () => {
    const trimmed = customCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed])
      setCustomCategory('')
    }
  }

  const toggleCollaboration = (type) => {
    setCollaborationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const addCity = () => {
    const value = cityInput.trim()
    if (!value) return
    if (!cities.includes(value)) {
      setCities((prev) => [...prev, value])
      setCityInput('')
    }
  }

  const removeCity = (idx) => {
    setCities((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleCityKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCity()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !influencer) return
    setError('')
    setSaving(true)

    const name = username.trim() || user.username || 'Kullanici'
    const handles = Object.keys(selectedPlatforms)
      .filter((id) => selectedPlatforms[id])
      .reduce((acc, id) => {
        acc[id] = (socialUsernames[id] || '').trim()
        return acc
      }, {})

    const fromIg = instagramHandle.replace(/^@/, '').trim()
    const displayName = fromIg || name

    let avatarUrl = ''
    if (avatarUpload) avatarUrl = avatarUpload
    else if (profilePhotoUrl.trim() && /^https?:\/\//i.test(profilePhotoUrl.trim()))
      avatarUrl = profilePhotoUrl.trim()
    else if (profilePhotoUrl.trim().startsWith('data:'))
      avatarUrl = profilePhotoUrl.trim()

    const igFormatted = instagramHandle.trim()
      ? instagramHandle.trim().startsWith('@')
        ? instagramHandle.trim()
        : '@' + instagramHandle.trim()
      : ''

    const payload = {
      id: influencer.id,
      userId: user.id,
      username: displayName,
      fullName: displayName,
      avatar: avatarUrl,
      instagramHandle: igFormatted,
      followers: parseInt(followers, 10) || 0,
      city: cities.length ? cities[0] : CITY_FILTER_ALL,
      cities: cities.length ? cities : [CITY_FILTER_ALL],
      categories: categories.length ? categories : ['Genel'],
      collaborationTypes,
      bio: bio.trim() || '',
    }

    try {
      if (hasSupabase && supabase) {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
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
      await upsertInfluencer(payload)
      if (typeof window !== 'undefined')
        window.dispatchEvent(new CustomEvent('influencers-updated'))
      setSaved(true)
      setTimeout(() => navigate('/profilim'), 1200)
    } catch (err) {
      setError(err.message || 'Kaydedilirken hata olustu.')
    } finally {
      setSaving(false)
    }
  }

  const cityOptions = [CITY_FILTER_ALL, ...CITIES]

  if (!user) return null

  if (loading) {
    return (
      <div className={cpStyles.page}>
        <div className="container">
          <p className={styles.loadingText}>Profil yukleniyor...</p>
        </div>
      </div>
    )
  }

  if (saved) {
    return (
      <div className={cpStyles.page}>
        <div className="container">
          <div className={cpStyles.successCard}>
            <h2>Profil guncellendi</h2>
            <p>Profilim sayfasina yonlendiriliyorsunuz...</p>
            <Link to="/profilim" className={cpStyles.successButton}>
              Profilime git
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cpStyles.page}>
      <div className="container">
        <div className={cpStyles.header}>
          <h1>Profilimi duzenle</h1>
          <p>
            Kayit sirasindaki gibi tum alanlari guncelleyebilirsiniz. E-posta ve sifre buradan
            degismez.
          </p>
        </div>

        {error && (
          <p className={styles.errorBanner} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className={cpStyles.form}>
          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Hesap</h2>
            <div className={cpStyles.field}>
              <label className={cpStyles.label}>Kullanici adi (hesap)</label>
              <input
                type="text"
                className={cpStyles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kullanici_adi"
              />
            </div>
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
          </section>

          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Instagram / Kesfet profili</h2>
            <div className={cpStyles.field}>
              <label className={cpStyles.label}>Profil fotografi</label>
              <p className={cpStyles.hint}>
                Istege bagli. Kaldirmak icin URL ve yuklemeyi temizleyin; kartta bas harf gorunur.
              </p>
              <input
                type="url"
                className={cpStyles.input}
                value={profilePhotoUrl}
                onChange={(e) => {
                  setProfilePhotoUrl(e.target.value)
                  setAvatarUpload(null)
                }}
                placeholder="https://... (opsiyonel)"
              />
              <div className={cpStyles.uploadRow}>
                <label className={cpStyles.fileLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) {
                        const r = new FileReader()
                        r.onload = () => setAvatarUpload(r.result)
                        r.readAsDataURL(f)
                        setProfilePhotoUrl('')
                      }
                    }}
                  />
                  Fotograf yukle
                </label>
                {avatarUpload && (
                  <span className={cpStyles.uploadPreview}>
                    <img src={avatarUpload} alt="Onizleme" width={48} height={48} style={{ borderRadius: 999 }} />
                    <button type="button" className={cpStyles.removeUpload} onClick={() => setAvatarUpload(null)}>
                      Kaldir
                    </button>
                  </span>
                )}
              </div>
            </div>
            <div className={cpStyles.field}>
              <label className={cpStyles.label}>Instagram kullanici adi (gosterim)</label>
              <input
                type="text"
                className={cpStyles.input}
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@kullanici_adi"
              />
            </div>
            <div className={cpStyles.field}>
              <label className={cpStyles.label}>Takipci sayisi (yaklasik)</label>
              <input
                type="number"
                className={cpStyles.input}
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="10000"
                min="0"
              />
            </div>
          </section>

          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Konum</h2>
            <div className={cpStyles.field}>
              <label className={cpStyles.label}>Sehirler</label>
              <div className={cpStyles.cityInputRow}>
                <input
                  type="text"
                  className={cpStyles.input}
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={handleCityKeyDown}
                  list="profil-duzenle-cities"
                  placeholder="Butun sehirler veya sehir secin / yazin"
                  autoComplete="off"
                />
                <button type="button" className={cpStyles.addButton} onClick={addCity}>
                  Ekle
                </button>
              </div>
              <datalist id="profil-duzenle-cities">
                {cityOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className={cpStyles.cityChips}>
                {cities.map((c, idx) => (
                  <span key={idx} className={cpStyles.cityChip}>
                    {c}
                    <button type="button" className={cpStyles.chipRemove} onClick={() => removeCity(idx)} aria-label="Kaldir">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Icerik kategorileri</h2>
            <p className={cpStyles.hint}>Birden fazla secenek isaretleyebilirsiniz.</p>
            <div className={cpStyles.chipGroup}>
              {CONTENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={categories.includes(cat) ? cpStyles.chipActive : cpStyles.chip}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={cpStyles.customCategory}>
              <input
                type="text"
                className={cpStyles.input}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Kategori ekle"
              />
              <button type="button" className={cpStyles.addButton} onClick={addCustomCategory}>
                Ekle
              </button>
            </div>
            {categories.length > 0 && (
              <p className={cpStyles.selectedHint}>Secilen: {categories.join(', ')}</p>
            )}
          </section>

          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Is birligi turleri</h2>
            <div className={cpStyles.chipGroup}>
              {COLLABORATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={collaborationTypes.includes(type) ? cpStyles.chipActive : cpStyles.chip}
                  onClick={() => toggleCollaboration(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className={cpStyles.section}>
            <h2 className={cpStyles.sectionTitle}>Kisa biyografi</h2>
            <textarea
              className={cpStyles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendinizi ve ne tur is birlikleri aradiginizi kisa aciklayin."
              rows={4}
            />
          </section>

          <div className={cpStyles.actions}>
            <button type="submit" className={cpStyles.submitButton} disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/profilim" className={cpStyles.cancelLink}>
              Iptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
