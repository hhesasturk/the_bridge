import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CONTENT_CATEGORIES, COLLABORATION_TYPES, CITIES, CITY_FILTER_ALL } from '../config/constants'
import { saveInfluencer, generateId } from '../utils/influencerStorage'
import styles from '../styles/CreateProfile.module.css'

const PENDING_USER_KEY = 'thebridge_pending_user'
const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'

export default function CreateProfile() {
  const navigate = useNavigate()
  const [instagramHandle, setInstagramHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [cities, setCities] = useState([CITY_FILTER_ALL])
  const [cityInput, setCityInput] = useState('')
  const [categories, setCategories] = useState([])
  const [customCategory, setCustomCategory] = useState('')
  const [collaborationTypes, setCollaborationTypes] = useState([])
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_USER_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      const firstHandle = data.socialHandles?.instagram || data.socialHandles?.tiktok || data.socialHandles?.youtube || data.socialHandles?.x || data.socialHandles?.facebook
      if (firstHandle && !instagramHandle) setInstagramHandle(firstHandle.startsWith('@') ? firstHandle : '@' + firstHandle)
    } catch (_) {}
  }, [])

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
    const toAdd = value
    if (!cities.includes(toAdd)) {
      setCities((prev) => [...prev, toAdd])
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const displayName = instagramHandle.replace(/^@/, '') || 'influencer'
    const avatarUrl = profilePhotoUrl.trim() && /^https?:\/\//i.test(profilePhotoUrl.trim())
      ? profilePhotoUrl.trim()
      : PLACEHOLDER_AVATAR
    const newInfluencer = {
      id: generateId(),
      username: displayName,
      fullName: displayName,
      avatar: avatarUrl,
      instagramHandle: instagramHandle ? (instagramHandle.startsWith('@') ? instagramHandle : '@' + instagramHandle) : '',
      followers: parseInt(followers, 10) || 0,
      city: cities.length ? cities[0] : CITY_FILTER_ALL,
      cities: cities.length ? cities : [CITY_FILTER_ALL],
      categories: categories.length ? categories : ['Genel'],
      collaborationTypes,
      bio: bio.trim() || '',
    }
    saveInfluencer(newInfluencer)
    try {
      localStorage.removeItem(PENDING_USER_KEY)
    } catch (_) {}
    setSaved(true)
    setTimeout(() => navigate('/kesfet'), 1200)
  }

  if (saved) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.successCard}>
            <h2>Profil kaydedildi</h2>
            <p>Profiliniz kesfet sayfasina eklendi. Yonlendiriliyorsunuz...</p>
            <Link to="/kesfet" className={styles.successButton}>
              Influencer kesfet sayfasina git
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const cityOptions = [CITY_FILTER_ALL, ...CITIES]

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>Influencer Profil Olustur</h1>
          <p>Profilinizi tamamlayin, markalar sizi bulabilsin.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Instagram / Sosyal Medya</h2>
            <div className={styles.field}>
              <label className={styles.label}>Profil fotoğrafı</label>
              <input
                type="url"
                className={styles.input}
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
                placeholder="Instagram profil fotoğrafı URL'si (opsiyonel)"
              />
              <p className={styles.hint}>
                Instagram'da profil fotoğrafınıza sağ tıklayıp &quot;Resim adresini kopyala&quot; ile linki alıp buraya yapıştırabilirsiniz. Otomatik çekim için ileride sunucu tarafı entegrasyon gerekir.
              </p>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Instagram kullanici adi (gosterim icin)</label>
              <input
                type="text"
                className={styles.input}
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@kullanici_adi"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Takipci sayisi (yaklasik)</label>
              <input
                type="number"
                className={styles.input}
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="10000"
                min="0"
              />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Konum</h2>
            <div className={styles.field}>
              <label className={styles.label}>Sehirler (onerilen: Butun sehirler; birden fazla secebilirsiniz)</label>
              <div className={styles.cityInputRow}>
                <input
                  type="text"
                  className={styles.input}
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={handleCityKeyDown}
                  list="cities-list"
                  placeholder="Butun sehirler veya sehir secin / yazin"
                  autoComplete="off"
                />
                <button type="button" className={styles.addButton} onClick={addCity}>
                  Ekle
                </button>
              </div>
              <datalist id="cities-list">
                {cityOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className={styles.cityChips}>
                {cities.map((c, idx) => (
                  <span key={idx} className={styles.cityChip}>
                    {c}
                    <button type="button" className={styles.chipRemove} onClick={() => removeCity(idx)} aria-label="Kaldir">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Icerik Kategorileri</h2>
            <p className={styles.hint}>Birden fazla secenek isaretleyebilirsiniz. Isterseniz asagidan kategori ekleyebilirsiniz.</p>
            <div className={styles.chipGroup}>
              {CONTENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={categories.includes(cat) ? styles.chipActive : styles.chip}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.customCategory}>
              <input
                type="text"
                className={styles.input}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Kategori ekle (ornek: Sanat)"
              />
              <button type="button" className={styles.addButton} onClick={addCustomCategory}>
                Ekle
              </button>
            </div>
            {categories.length > 0 && (
              <p className={styles.selectedHint}>Secilen: {categories.join(', ')}</p>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kabul Ettiginiz Is Birligi Turleri</h2>
            <div className={styles.chipGroup}>
              {COLLABORATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={collaborationTypes.includes(type) ? styles.chipActive : styles.chip}
                  onClick={() => toggleCollaboration(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kisa Biyografi</h2>
            <textarea
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendinizi ve ne tur is birlikleri aradiginizi kisa aciklayin."
              rows={4}
            />
          </section>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              Profili Kaydet
            </button>
            <Link to="/" className={styles.cancelLink}>
              Iptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
