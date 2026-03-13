import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOCIAL_PLATFORMS } from '../config/constants'
import { getUsers, addUser, validateLogin, setCurrentUser, generateUserId } from '../utils/authStorage'
import styles from '../styles/Auth.module.css'

const PENDING_KEY = 'thebridge_pending_user'

const EMAIL_WARNING = 'Dogru e-posta girdiginizden emin olun; daha sonra dogrulama yapmaniz gerekebilir.'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState({})
  const [socialUsernames, setSocialUsernames] = useState({})
  const [error, setError] = useState('')

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

  const setSocialUsername = (platformId, value) => {
    setSocialUsernames((prev) => ({ ...prev, [platformId]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const emailTrim = email.trim().toLowerCase()
    const passwordVal = password

    if (isLogin) {
      const user = validateLogin(emailTrim, passwordVal)
      if (!user) {
        setError('Bu e-posta ile kayitli hesap bulunamadi veya sifre hatali. Lutfen uye olun veya bilgilerinizi kontrol edin.')
        return
      }
      setCurrentUser(user)
      navigate('/profilim')
      return
    }

    if (!username.trim()) {
      setError('Kullanici adi girin.')
      return
    }
    const users = getUsers()
    if (users.some((u) => u.email === emailTrim)) {
      setError('Bu e-posta adresi zaten kayitli.')
      return
    }
    const userId = generateUserId()
    const added = addUser({ id: userId, email: emailTrim, username: username.trim(), password: passwordVal })
    if (!added) {
      setError('Kayit yapilamadi. E-posta zaten kullaniliyor olabilir.')
      return
    }
    const socialHandles = Object.keys(selectedPlatforms)
      .filter((id) => selectedPlatforms[id] && socialUsernames[id]?.trim())
      .reduce((acc, id) => {
        acc[id] = socialUsernames[id]?.trim() || ''
        return acc
      }, {})
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({ userId, email: emailTrim, username: username.trim(), socialHandles }))
    } catch (_) {}
    setCurrentUser(added)
    navigate('/profil-olustur')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>{isLogin ? 'Giris Yap' : 'Uye Ol'}</h1>
          <p className={styles.subtitle}>
            {isLogin
              ? 'Hesabina giris yap. Sadece kayitli e-posta ve sifre ile giris yapilir.'
              : 'Kullanici adi, e-posta ve sifre ile uye olun; sosyal medya hesaplarinizi profil adiminda ekleyin.'}
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <>
                <label className={styles.label}>Kullanici adi</label>
                <input
                  type="text"
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullanici_adi"
                  required
                />
              </>
            )}

            <label className={styles.label}>E-posta</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
            {!isLogin && (
              <p className={styles.emailWarning}>{EMAIL_WARNING}</p>
            )}

            <label className={styles.label}>Sifre</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            {!isLogin && (
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
            )}

            <button type="submit" className={styles.submitButton}>
              {isLogin ? 'Giris Yap' : 'Uye Ol'}
            </button>
          </form>

          <p className={styles.toggle}>
            {isLogin ? 'Hesabin yok mu?' : 'Zaten uye misin?'}{' '}
            <button type="button" className={styles.toggleButton} onClick={() => { setIsLogin(!isLogin); setError('') }}>
              {isLogin ? 'Uye ol' : 'Giris yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
