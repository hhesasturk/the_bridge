import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOCIAL_PLATFORMS } from '../config/constants'
import styles from '../styles/Auth.module.css'

const STORAGE_KEY = 'thebridge_pending_user'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState({})
  const [socialUsernames, setSocialUsernames] = useState({})

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) {
        setSocialUsernames((u) => {
          const u2 = { ...u }
          delete u2[id]
          return u2
        })
      }
      return next
    })
  }

  const setUsername = (platformId, value) => {
    setSocialUsernames((prev) => ({ ...prev, [platformId]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('Giris:', { email, password })
      navigate('/kesfet')
    } else {
      const socialHandles = Object.keys(selectedPlatforms)
        .filter((id) => selectedPlatforms[id] && socialUsernames[id]?.trim())
        .reduce((acc, id) => {
          acc[id] = socialUsernames[id]?.trim() || ''
          return acc
        }, {})
      const payload = { email, password, socialHandles }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch (_) {}
      navigate('/profil-olustur')
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>
            {isLogin ? 'Giris Yap' : 'Uye Ol'}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? 'Hesabina giris yap ve devam et.'
              : 'Platform ucretsizdir. E-posta ve sifre ile uye olun; sosyal medya hesaplarinizi ekleyin.'}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>E-posta</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />

            <label className={styles.label}>Sifre</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {!isLogin && (
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>Sosyal medya hesaplari</h3>
                <p className={styles.socialHint}>
                  Istediklerinizi secin, kullanici adini yazin.
                </p>
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
                        onChange={(e) => setUsername(id, e.target.value)}
                        placeholder={id === 'instagram' ? '@kullanici_adi' : 'Kullanici adi'}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              {isLogin ? 'Giris Yap' : 'Uye Ol'}
            </button>
          </form>

          <p className={styles.toggle}>
            {isLogin ? 'Hesabin yok mu?' : 'Zaten uye misin?'}{' '}
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Uye ol' : 'Giris yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
